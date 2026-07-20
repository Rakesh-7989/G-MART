import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { data, error } = await getApiSupabase()
    .from("categories")
    .select("*")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const body = await request.json();
    const { name, slug, description, image_url } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("categories")
      .insert({ name, slug, description: description || null, image_url: image_url || null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const body = await request.json();
    const { id, name, slug, description, image_url } = body;

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("categories")
      .update({ name, slug, description, image_url })
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
    return NextResponse.json({ error: "Category ID required" }, { status: 400 });
  }

  const { error } = await getApiSupabase()
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
