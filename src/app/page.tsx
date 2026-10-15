import Link from "next/link";
import { redirect } from "next/navigation";
import { Compass, Sparkles, LineChart, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/resources");

  const props = [
    {
      icon: Compass,
      title: "Learn the method",
      body: "Five focused guides on structuring, market sizing and MECE thinking.",
    },
    {
      icon: Sparkles,
      title: "Practise by type",
      body: "AI-generated questions by category and difficulty, graded like an interviewer would.",
    },
    {
      icon: LineChart,
      title: "See your progress",
      body: "Every attempt saved, with scores and trends over time.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
            <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Ballpark</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pt-16 text-center md:pt-24">
        <span className="mb-4 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
          Consulting interview prep
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Practice guesstimates the way you&apos;ll be tested.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
          Get interviewer-style feedback on your structure, assumptions and maths — in seconds.
        </p>
        <Link
          href="/signup"
          className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          Start practising
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-20 grid w-full grid-cols-1 gap-5 pb-20 md:grid-cols-3">
          {props.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.body}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
