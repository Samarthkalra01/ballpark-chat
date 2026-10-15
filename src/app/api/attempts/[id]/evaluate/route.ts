import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateRequestSchema, computeOverall } from "@/lib/ai/schemas";
import { evaluateAnswer } from "@/lib/ai/gemini";
import { incrementUsage, evaluationLimit } from "@/lib/limits";
import { htmlToText } from "@/lib/html-to-text";
import { countWords } from "@/lib/utils";
import { MIN_ANSWER_WORDS } from "@/lib/constants";
import type { AttemptRow } from "@/lib/types";
import type { CategoryKey, DifficultyKey } from "@/lib/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = evaluateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { answerHtml, timeSpentSeconds } = parsed.data;

  // Load the attempt (RLS guarantees ownership).
  const { data: attempt } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", id)
    .single<AttemptRow>();

  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ error: "Already evaluated" }, { status: 409 });
  }

  // Server-side HTML → text (tables as "cell | cell"); don't trust the client's copy.
  const answerText = htmlToText(answerHtml);

  if (countWords(answerText) < MIN_ANSWER_WORDS) {
    return NextResponse.json(
      { error: "too_short", message: `Write at least ${MIN_ANSWER_WORDS} words before submitting.` },
      { status: 400 },
    );
  }

  // Save the answer immediately so it is never lost, even if evaluation fails.
  await supabase
    .from("attempts")
    .update({
      answer_html: answerHtml,
      answer_text: answerText,
      time_spent_seconds: timeSpentSeconds,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", id);

  // Daily evaluation limit.
  const allowed = await incrementUsage(supabase, "evaluation", evaluationLimit());
  if (!allowed) {
    return NextResponse.json(
      { error: "limit", message: "You've hit today's evaluation limit — come back tomorrow!" },
      { status: 429 },
    );
  }

  try {
    const evaluation = await evaluateAnswer({
      question: attempt.question,
      category: attempt.category as CategoryKey,
      difficulty: attempt.difficulty as DifficultyKey,
      expectedAnswerRange: attempt.expected_answer_range ?? "",
      keyDrivers: attempt.key_drivers ?? [],
      answerText,
    });

    // Recompute the overall score from the rubric on the server.
    const score = computeOverall(evaluation.rubric);

    const { error: updateErr } = await supabase
      .from("attempts")
      .update({
        status: "evaluated",
        score,
        rubric: evaluation.rubric,
        feedback: { ...evaluation, overall_score: score },
        evaluated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateErr) {
      console.error("[evaluate] save failed:", updateErr.message);
      return NextResponse.json({ error: "Could not save evaluation" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, attemptId: id, score });
  } catch (err) {
    console.error("[evaluate] Gemini failed:", err);
    // Answer stays saved; attempt remains in_progress so the user can retry.
    return NextResponse.json(
      {
        error: "eval_failed",
        message: "Evaluation failed — your answer is saved. Try again.",
      },
      { status: 502 },
    );
  }
}
