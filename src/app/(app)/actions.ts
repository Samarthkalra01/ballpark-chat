"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function skipAttempt(id: string) {
  const supabase = await createClient();
  await supabase
    .from("attempts")
    .update({ status: "abandoned" })
    .eq("id", id)
    .eq("status", "in_progress");
  redirect("/solve");
}

/** Create a fresh in_progress attempt with the same question. */
export async function retryAttempt(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: src } = await supabase
    .from("attempts")
    .select(
      "category, difficulty, geography, question, clarifications, expected_answer_range, key_drivers, source",
    )
    .eq("id", id)
    .single();

  if (!src) redirect("/solve");

  const { data: created } = await supabase
    .from("attempts")
    .insert({ ...src, user_id: user.id, status: "in_progress" })
    .select("id")
    .single();

  redirect(created ? `/solve/${created.id}` : "/solve");
}
