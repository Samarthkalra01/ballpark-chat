import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { getUserPlan } from "@/lib/subscription";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name?.trim() || user.email?.split("@")[0] || "there";

  const plan = await getUserPlan(supabase, user.id);

  return (
    <AppShell userName={fullName} userSubtitle={user.email ?? ""} isPro={plan === "pro"}>
      {children}
    </AppShell>
  );
}
