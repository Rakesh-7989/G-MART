import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";
import { validate, productUpdateSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(_request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { data, error } = await getApiSupabase()
    .from("products")
    .select("*, categories(name)")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const body = await request.json();
    const validated = validate(productUpdateSchema, body);
    if ("error" in validated) return validated.error;
    const { data, error } = await getApiSupabase()
      .from("products")
      .update(validated.data)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { error } = await getApiSupabase().from("products").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
