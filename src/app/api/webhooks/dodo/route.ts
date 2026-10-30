import { Webhook } from "standardwebhooks";
import { createAdminClient } from "@/lib/supabase/admin";

// Events that grant / keep Pro access.
const GRANT = new Set([
  "subscription.active",
  "subscription.renewed",
  "subscription.updated",
  "subscription.unpaused",
  "subscription.plan_changed",
]);
// Events that revoke Pro access (non-paying states).
const REVOKE = new Set([
  "subscription.cancelled",
  "subscription.expired",
  "subscription.failed",
  "subscription.on_hold",
  "subscription.past_due",
  "subscription.paused",
]);

export async function POST(req: Request) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!secret) {
    console.error("[dodo webhook] DODO_PAYMENTS_WEBHOOK_KEY not set");
    return new Response("Not configured", { status: 500 });
  }

  const raw = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
  };

  // Verify the Standard Webhooks signature on the RAW body.
  // The payload shape is external and validated at runtime, so `any` is used.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(raw, headers);
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  const type: string = event?.type ?? "";
  if (!type.startsWith("subscription.")) {
    return Response.json({ received: true });
  }

  const data = event?.data ?? {};
  const subscriptionId: string | undefined = data.subscription_id;
  const customerId: string | undefined = data.customer?.customer_id;
  const metaUserId: string | undefined = data.metadata?.supabase_user_id;
  const nextBilling: string | null = data.next_billing_date ?? null;

  const admin = createAdminClient();

  // Map the event to a Supabase user: prefer metadata, else match by subscription id.
  let userId = metaUserId;
  if (!userId && subscriptionId) {
    const { data: row } = await admin
      .from("subscriptions")
      .select("user_id")
      .eq("dodo_subscription_id", subscriptionId)
      .maybeSingle();
    userId = row?.user_id;
  }
  if (!userId) {
    console.error("[dodo webhook] unmapped event", { type, subscriptionId });
    return Response.json({ received: true }); // ack so Dodo stops retrying
  }

  let plan: "free" | "pro" = "free";
  let status = type.replace("subscription.", "");
  if (GRANT.has(type)) {
    plan = "pro";
    status = "active";
  } else if (REVOKE.has(type)) {
    plan = "free";
  }

  // Preserve existing Dodo ids if this event omits them.
  const { data: existing } = await admin
    .from("subscriptions")
    .select("dodo_customer_id, dodo_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      dodo_customer_id: customerId ?? existing?.dodo_customer_id ?? null,
      dodo_subscription_id: subscriptionId ?? existing?.dodo_subscription_id ?? null,
      current_period_end: nextBilling,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("[dodo webhook] upsert failed:", error.message);
    return new Response("DB error", { status: 500 });
  }

  return Response.json({ received: true });
}
