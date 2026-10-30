import "server-only";
import DodoPayments from "dodopayments";

/** Dodo Payments client (server-only). Switches test/live via env. */
export function getDodoClient(): DodoPayments {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) throw new Error("DODO_PAYMENTS_API_KEY is not set");
  const environment =
    (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") || "test_mode";
  return new DodoPayments({ bearerToken, environment });
}

/** The Dodo product id for the monthly Pro subscription. */
export const DODO_PRODUCT_ID = process.env.DODO_PRODUCT_ID ?? "";
