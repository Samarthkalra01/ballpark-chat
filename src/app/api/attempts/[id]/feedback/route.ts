import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { feedbackRequestSchema } from "@/lib/ai/schemas";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // RLS ensures the user can only update their own attempt.
  const { error } = await supabase
    .from("attempts")
    .update({ helpful: parsed.data.helpful })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Could not save feedback" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
