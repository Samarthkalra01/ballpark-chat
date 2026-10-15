import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { CheckCircle2, TrendingUp, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ScoreRing } from "@/components/results/score-ring";
import { RubricBars } from "@/components/results/rubric-bars";
import { HelpfulButtons, ResultActions } from "@/components/results/feedback-actions";
import { CategoryBadge, DifficultyPill } from "@/components/ui/badges";
import { CATEGORY_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { AttemptRow } from "@/lib/types";

export const metadata = { title: "Your Feedback" };

export default async function ResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single<AttemptRow>();

  if (!attempt) notFound();
  if (attempt.status !== "evaluated" || !attempt.feedback || !attempt.rubric) {
    redirect(`/solve/${attemptId}`);
  }

  const fb = attempt.feedback;
  const score = attempt.score ?? fb.overall_score;
  const cleanAnswer = DOMPurify.sanitize(attempt.answer_html ?? "");

  const { data: recent } = await supabase
    .from("attempts")
    .select("id, question, score, created_at, category, difficulty")
    .eq("status", "evaluated")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Results card */}
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center gap-6 border-b border-slate-100 pb-6 md:flex-row md:items-center">
          <ScoreRing score={score} />
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Rating
              </span>
              <CategoryBadge label={CATEGORY_LABEL[attempt.category]} />
              <DifficultyPill difficulty={attempt.difficulty} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 md:text-2xl">{fb.verdict}</h1>
            {fb.model_answer_range && (
              <p className="text-xs text-slate-500">
                Reasonable range: <strong className="text-slate-700">{fb.model_answer_range}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Question reminder */}
        <p className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
          {attempt.question}
        </p>

        {/* Strengths + improvements */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              What you did well
            </div>
            <ul className="space-y-3 text-xs font-medium leading-relaxed text-emerald-800">
              {fb.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Areas for improvement
            </div>
            <ul className="space-y-3 text-xs font-medium leading-relaxed text-amber-900">
              {fb.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-600">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <RubricBars rubric={attempt.rubric} />

        {/* Model approach */}
        <details className="group rounded-2xl border border-slate-200 bg-white p-5">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-slate-800">
            How an interviewer might approach it
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-slate-600">
            {fb.model_approach.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>

        {/* Your answer */}
        <details className="group rounded-2xl border border-slate-200 bg-white p-5">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-slate-800">
            Your answer
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div
            className="answer-render mt-4 text-sm leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: cleanAnswer }}
          />
        </details>

        {/* Helpful + actions */}
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          <HelpfulButtons attemptId={attempt.id} initialHelpful={attempt.helpful} />
          <ResultActions attemptId={attempt.id} category={attempt.category} />
        </div>
      </div>

      {/* Last 5 attempts */}
      {recent && recent.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">
            Your last {recent.length} attempts
          </h3>
          <ul className="divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/solve/${r.id}/result`}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                    {r.question}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatDate(r.created_at as string)}
                  </span>
                  <span className="shrink-0 font-bold text-slate-800">{r.score} / 10</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
