import type { SupabaseClient } from "@supabase/supabase-js";

export type Plan = "free" | "pro";

export interface SubscriptionInfo {
  plan: Plan;
  status: string;
  currentPeriodEnd: string | null;
}

/**
 * Resolve a user's effective plan. Pro only when the row says plan=pro,
 * status=active, and the paid period hasn't lapsed (guards missed webhooks).
 * Reads via the caller's client; RLS "read own" allows the user to see it.
 */
export async function getSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionInfo> {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { plan: "free", status: "inactive", currentPeriodEnd: null };

  const notExpired =
    !data.current_period_end || new Date(data.current_period_end) > new Date();
  const isPro = data.plan === "pro" && data.status === "active" && notExpired;

  return {
    plan: isPro ? "pro" : "free",
    status: data.status,
    currentPeriodEnd: data.current_period_end,
  };
}

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string,
): Promise<Plan> {
  return (await getSubscription(supabase, userId)).plan;
}
