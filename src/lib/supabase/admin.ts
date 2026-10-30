import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client using the SERVICE-ROLE key. Bypasses RLS.
 * SERVER-ONLY: used exclusively in the Dodo webhook route to write
 * subscription state. The service-role key must never be exposed to the
 * browser or prefixed with NEXT_PUBLIC_.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
