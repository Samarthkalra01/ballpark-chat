import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RESOURCES } from "@/content/resources";
import { Icon } from "@/components/ui/icon";
import { CATEGORY_LABEL, type CategoryKey } from "@/lib/constants";

export const metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();
  const firstName = (profile?.full_name?.trim() || user?.email?.split("@")[0] || "there").split(
    " ",
  )[0];

  const { data: evaluated } = await supabase
    .from("attempts")
    .select("score, category")
    .eq("status", "evaluated");

  const attempts = evaluated ?? [];
  const hasAttempts = attempts.length > 0;
  const avgScore = hasAttempts
    ? Math.round(
        (attempts.reduce((s, a) => s + (a.score ?? 0), 0) / attempts.length) * 10,
      ) / 10
    : 0;

  // Best category = highest average score.
  let bestCategory: string | null = null;
  if (hasAttempts) {
    const byCat: Record<string, { sum: number; n: number }> = {};
    for (const a of attempts) {
      const c = a.category as string;
      byCat[c] = byCat[c] || { sum: 0, n: 0 };
      byCat[c].sum += a.score ?? 0;
      byCat[c].n += 1;
    }
    const best = Object.entries(byCat).sort((x, y) => y[1].sum / y[1].n - x[1].sum / x[1].n)[0];
    if (best) bestCategory = CATEGORY_LABEL[best[0] as CategoryKey] ?? best[0];
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          {hasAttempts ? `Welcome back, ${firstName} 👋` : `Welcome, ${firstName} 👋`}
        </h2>
        <p className="mt-1 text-sm text-slate-500">Sharpen your structure before you solve.</p>
      </div>

      {/* Stats strip */}
      {hasAttempts && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Total attempts" value={String(attempts.length)} />
          <Stat label="Average score" value={`${avgScore} / 10`} />
          <Stat label="Best category" value={bestCategory ?? "—"} />
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r) => (
          <Link
            key={r.slug}
            href={`/resources/${r.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon name={r.icon} className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">{r.title}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{r.subtitle}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-bold text-indigo-600">
              Read
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* CTA banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row md:p-8">
        <div>
          <h3 className="text-lg font-bold">Ready to practise?</h3>
          <p className="mt-1 text-sm text-slate-300">
            Pick a type and difficulty, and get interviewer-style feedback in seconds.
          </p>
        </div>
        <Link
          href="/solve"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          Start a guesstimate
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-800">{value}</div>
    </div>
  );
}
