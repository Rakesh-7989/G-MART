import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { data, error } = await getApiSupabase()
    .from("reviews")
    .select("*, products(name), users(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const body = await request.json();
    const { id, is_approved } = body;

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("reviews")
      .update({ is_approved })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  const { error } = await getApiSupabase()
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
