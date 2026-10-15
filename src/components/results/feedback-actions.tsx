"use client";

import Link from "next/link";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, RotateCcw, Repeat, ListChecks } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { retryAttempt } from "@/app/(app)/actions";
import { cn } from "@/lib/utils";
import type { CategoryKey } from "@/lib/constants";

export function HelpfulButtons({
  attemptId,
  initialHelpful,
}: {
  attemptId: string;
  initialHelpful: boolean | null;
}) {
  const { toast } = useToast();
  const [helpful, setHelpful] = useState<boolean | null>(initialHelpful);

  async function send(value: boolean) {
    setHelpful(value); // optimistic
    try {
      const res = await fetch(`/api/attempts/${attemptId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful: value }),
      });
      if (!res.ok) throw new Error();
      toast("Thanks for the feedback!", "success");
    } catch {
      toast("Couldn't save your feedback.", "error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-slate-500">Was this feedback helpful?</span>
      <button
        onClick={() => send(true)}
        aria-label="Helpful"
        aria-pressed={helpful === true}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
          helpful === true
            ? "border-emerald-300 bg-emerald-50 text-emerald-600"
            : "border-slate-200 text-slate-500 hover:bg-slate-50",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button
        onClick={() => send(false)}
        aria-label="Not helpful"
        aria-pressed={helpful === false}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
          helpful === false
            ? "border-rose-300 bg-rose-50 text-rose-600"
            : "border-slate-200 text-slate-500 hover:bg-slate-50",
        )}
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ResultActions({
  attemptId,
  category,
}: {
  attemptId: string;
  category: CategoryKey;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={`/solve?category=${category}`}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
      >
        <RotateCcw className="h-4 w-4" />
        Try another
      </Link>
      <form action={retryAttempt.bind(null, attemptId)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200"
        >
          <Repeat className="h-4 w-4" />
          Retry this question
        </button>
      </form>
      <Link
        href="/history"
        className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200"
      >
        <ListChecks className="h-4 w-4" />
        View all attempts
      </Link>
    </div>
  );
}
