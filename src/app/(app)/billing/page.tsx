import { Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import {
  generationLimit,
  evaluationLimit,
  proGenerationLimit,
  proEvaluationLimit,
} from "@/lib/limits";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sub = await getSubscription(supabase, user!.id);
  const isPro = sub.plan === "pro";

  const freeGen = generationLimit();
  const freeEval = evaluationLimit();
  const proGen = proGenerationLimit();
  const proEval = proEvaluationLimit();

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Billing</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your plan and daily practice limits.</p>
      </div>

      {status === "success" && !isPro && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
          Payment received — your Pro access will activate within a minute. Refresh if it hasn&apos;t updated.
        </div>
      )}

      {isPro && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
          <Check className="h-5 w-5 text-emerald-600" />
          You&apos;re on <strong>Pro</strong>
          {sub.currentPeriodEnd && <> — renews {formatDate(sub.currentPeriodEnd)}</>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">Free</h3>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            ₹0<span className="text-sm font-medium text-slate-500">/month</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <Feature>{freeGen} AI questions per day</Feature>
            <Feature>{freeEval} AI evaluations per day</Feature>
            <Feature>All resources and question types</Feature>
          </ul>
          {!isPro && (
            <p className="mt-6 text-center text-xs font-semibold text-slate-400">Your current plan</p>
          )}
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-6 shadow-sm">
          <span className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            <Sparkles className="h-3 w-3" /> Pro
          </span>
          <h3 className="text-lg font-bold text-slate-800">Pro</h3>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            ₹399<span className="text-sm font-medium text-slate-500">/month</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <Feature>{proGen} AI questions per day</Feature>
            <Feature>{proEval} AI evaluations per day</Feature>
            <Feature>Priority access to new features</Feature>
          </ul>
          <div className="mt-6">
            {isPro ? (
              <p className="text-center text-xs font-semibold text-emerald-600">Active</p>
            ) : (
              <UpgradeButton className="w-full" />
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Payments are processed securely by Dodo Payments. You can cancel anytime; Pro stays active
        until the end of the paid period.
      </p>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className={cn("flex items-start gap-2")}>
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <span>{children}</span>
    </li>
  );
}
