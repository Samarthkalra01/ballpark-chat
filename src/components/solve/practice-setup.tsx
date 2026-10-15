"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import {
  CATEGORIES,
  DIFFICULTY_KEYS,
  DIFFICULTY_LABEL,
  GEOGRAPHIES,
  type CategoryKey,
  type DifficultyKey,
  type Geography,
} from "@/lib/constants";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function PracticeSetup({ initialCategory }: { initialCategory: CategoryKey | null }) {
  const router = useRouter();
  const { toast } = useToast();

  const [category, setCategory] = useState<CategoryKey | null>(initialCategory);
  const [difficulty, setDifficulty] = useState<DifficultyKey>("medium");
  const [geography, setGeography] = useState<Geography>("India");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!category) return;
    setLoading(true);
    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty, geography }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        toast(data.message || "You've hit today's limit — come back tomorrow!", "error");
        setLoading(false);
        return;
      }
      if (!res.ok || !data.attemptId) {
        toast("Something went wrong generating a question. Please try again.", "error");
        setLoading(false);
        return;
      }
      router.push(`/solve/${data.attemptId}`);
    } catch {
      toast("Network error — please check your connection and try again.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Set up your practice</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a question type and difficulty, then generate your guesstimate.
        </p>
      </div>

      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {/* Categories */}
        <section>
          <h3 className="mb-1 text-lg font-bold text-slate-800">What do you want to practise?</h3>
          <p className="mb-6 text-xs text-slate-500">Pick a single category to focus your session.</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="radiogroup" aria-label="Category">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    "relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all",
                    selected
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50",
                  )}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                      selected ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600",
                    )}
                  >
                    <Icon name={cat.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{cat.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                      {cat.helper}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* Difficulty + geography */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="mb-1 text-lg font-bold text-slate-800">Difficulty</h3>
              <p className="text-xs text-slate-500">Calibrate the complexity of the scenario.</p>
            </div>
            <div className="flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1 md:w-auto">
              {DIFFICULTY_KEYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-all md:w-28",
                    difficulty === d
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {DIFFICULTY_LABEL[d]}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-xs">
            <label className="mb-1.5 block text-xs font-bold text-slate-800">Geography</label>
            <select
              value={geography}
              onChange={(e) => setGeography(e.target.value as Geography)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {GEOGRAPHIES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Action */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Powered by Gemini — with a question bank fallback if the AI is busy.
          </span>
          <button
            onClick={generate}
            disabled={!category || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <Spinner /> Crafting your question…
              </>
            ) : (
              <>
                Generate Question <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
