import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_GENERATION_LIMIT, DEFAULT_EVALUATION_LIMIT } from "@/lib/constants";

export function generationLimit(): number {
  const n = parseInt(process.env.DAILY_GENERATION_LIMIT ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_GENERATION_LIMIT;
}

export function evaluationLimit(): number {
  const n = parseInt(process.env.DAILY_EVALUATION_LIMIT ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_EVALUATION_LIMIT;
}

// Pro (paid) daily limits — higher caps for subscribers.
export function proGenerationLimit(): number {
  const n = parseInt(process.env.PRO_GENERATION_LIMIT ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 200;
}

export function proEvaluationLimit(): number {
  const n = parseInt(process.env.PRO_EVALUATION_LIMIT ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 150;
}

export function generationLimitForPlan(plan: "free" | "pro"): number {
  return plan === "pro" ? proGenerationLimit() : generationLimit();
}

export function evaluationLimitForPlan(plan: "free" | "pro"): number {
  return plan === "pro" ? proEvaluationLimit() : evaluationLimit();
}

/**
 * Atomically increments the user's daily usage via the `increment_usage` RPC.
 * Returns true if the action is allowed, false if the daily limit is reached.
 * On an unexpected DB error we fail open (log + allow) so a limiter hiccup
 * never takes the product down; the generation route also has a bank fallback.
 */
export async function incrementUsage(
  supabase: SupabaseClient,
  kind: "generation" | "evaluation",
  maxAllowed: number,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("increment_usage", {
    kind,
    max_allowed: maxAllowed,
  });

  if (error) {
    console.error(`[limits] increment_usage(${kind}) failed:`, error.message);
    return true;
  }
  return data === true;
}
