import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDodoClient, DODO_PRODUCT_ID } from "@/lib/dodo";

// Starts a Dodo Payments checkout for the monthly Pro subscription.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!DODO_PRODUCT_ID) {
    console.error("[billing] DODO_PRODUCT_ID is not set");
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim();

  try {
    const dodo = getDodoClient();
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: DODO_PRODUCT_ID, quantity: 1 }],
      customer: { email: user.email!, name: fullName || user.email!.split("@")[0] },
      billing_currency: "INR",
      billing_address: { country: "IN" },
      metadata: { supabase_user_id: user.id },
      return_url: `${siteUrl}/billing?status=success`,
    });

    const url = (session as { checkout_url?: string }).checkout_url;
    if (!url) throw new Error("checkout_url missing from Dodo response");
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[billing] checkout failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
