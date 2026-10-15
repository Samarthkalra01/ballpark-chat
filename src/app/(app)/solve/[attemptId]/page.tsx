import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActivePractice } from "@/components/solve/active-practice";
import type { AttemptRow } from "@/lib/types";

export const metadata = { title: "Active Practice" };

export default async function ActivePracticePage({
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
  if (attempt.status === "evaluated") redirect(`/solve/${attemptId}/result`);
  if (attempt.status === "abandoned") redirect("/solve");

  return (
    <ActivePractice
      attemptId={attempt.id}
      question={attempt.question}
      clarifications={attempt.clarifications ?? []}
      category={attempt.category}
      difficulty={attempt.difficulty}
    />
  );
}
