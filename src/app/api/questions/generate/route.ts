import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRequestSchema } from "@/lib/ai/schemas";
import { generateQuestion } from "@/lib/ai/gemini";
import { incrementUsage, generationLimitForPlan } from "@/lib/limits";
import { getUserPlan } from "@/lib/subscription";
import { pickBankQuestion } from "@/data/question-bank";

export async function POST(request: Request) {
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

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { category, difficulty, geography } = parsed.data;

  // Daily generation limit (higher for Pro subscribers).
  const plan = await getUserPlan(supabase, user.id);
  const allowed = await incrementUsage(supabase, "generation", generationLimitForPlan(plan));
  if (!allowed) {
    return NextResponse.json(
      {
        error: "limit",
        message:
          plan === "pro"
            ? "You've hit today's limit — come back tomorrow!"
            : "You've hit today's free limit — upgrade to Pro for higher limits.",
      },
      { status: 429 },
    );
  }

  // Last 15 question texts, to discourage repeats.
  const { data: recent } = await supabase
    .from("attempts")
    .select("question")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(15);
  const recentQuestions = (recent ?? []).map((r) => r.question as string);

  // Generate with Gemini; fall back to the seed bank on any failure (PRD FR-2.7).
  let question: string;
  let clarifications: string[] = [];
  let expectedRange = "";
  let keyDrivers: string[] = [];
  let source: "ai" | "bank" = "ai";

  try {
    const result = await generateQuestion({
      category,
      difficulty,
      geography,
      recentQuestions,
    });
    question = result.question;
    clarifications = result.clarifications;
    expectedRange = result.expected_answer_range;
    keyDrivers = result.key_drivers;
  } catch (err) {
    console.error("[generate] Gemini failed, using bank:", err);
    const bank = pickBankQuestion(category, difficulty);
    question = bank.question;
    expectedRange = bank.expected_answer_range;
    keyDrivers = bank.key_drivers;
    source = "bank";
  }

  const { data: inserted, error } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      category,
      difficulty,
      geography,
      question,
      clarifications,
      expected_answer_range: expectedRange,
      key_drivers: keyDrivers,
      source,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[generate] insert failed:", error?.message);
    return NextResponse.json({ error: "Could not create attempt" }, { status: 500 });
  }

  return NextResponse.json({ attemptId: inserted.id });
}
