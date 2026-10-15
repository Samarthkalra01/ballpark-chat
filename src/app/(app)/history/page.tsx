import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HistoryTable, type HistoryItem } from "@/components/history/history-table";
import { TrendChart } from "@/components/history/trend-chart";
import { CATEGORY_LABEL, type CategoryKey } from "@/lib/constants";

export const metadata = { title: "Past Performance" };

function istDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Consecutive days (ending today or yesterday) with at least one attempt. */
function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const cursor = new Date(`${todayStr}T00:00:00`);

  // Allow the streak to count from yesterday if nothing today yet.
  if (!set.has(todayStr)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (set.has(cursor.toLocaleDateString("en-CA"))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("attempts")
    .select("id, created_at, question, category, difficulty, score")
    .eq("status", "evaluated")
    .order("created_at", { ascending: false });

  const attempts = (data ?? []) as HistoryItem[];

  if (attempts.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-slate-800">No attempts yet</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Your scored guesstimates will show up here, with trends over time.
        </p>
        <Link
          href="/solve"
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          Start your first guesstimate
        </Link>
      </div>
    );
  }

  const total = attempts.length;
  const avg = Math.round((attempts.reduce((s, a) => s + a.score, 0) / total) * 10) / 10;

  // Best category by average score.
  const byCat: Record<string, { sum: number; n: number }> = {};
  for (const a of attempts) {
    byCat[a.category] = byCat[a.category] || { sum: 0, n: 0 };
    byCat[a.category].sum += a.score;
    byCat[a.category].n += 1;
  }
  const bestEntry = Object.entries(byCat).sort((x, y) => y[1].sum / y[1].n - x[1].sum / x[1].n)[0];
  const bestCategory = bestEntry ? CATEGORY_LABEL[bestEntry[0] as CategoryKey] : "—";

  const streak = computeStreak(attempts.map((a) => istDate(a.created_at)));

  // Trend: oldest → newest, last 20.
  const trend = [...attempts]
    .reverse()
    .slice(-20)
    .map((a, i) => ({ label: `#${i + 1}`, score: a.score }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          Past Performance
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your scores across categories and revisit any attempt&apos;s feedback.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total attempts" value={String(total)} />
        <SummaryCard label="Average score" value={`${avg} / 10`} />
        <SummaryCard label="Best category" value={bestCategory} />
        <SummaryCard label="Current streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
      </div>

      <TrendChart data={trend} />

      <HistoryTable items={attempts} />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 truncate text-xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
