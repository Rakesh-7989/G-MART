import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { data, error } = await getApiSupabase()
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const body = await request.json();
    const { code, type, value, min_order_amount, max_discount, max_uses, expires_at, description } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Code, type, and value are required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("coupons")
      .insert({
        code: code.toUpperCase(),
        type,
        value: parseInt(value),
        min_order_amount: min_order_amount ? parseInt(min_order_amount) : 0,
        max_discount: max_discount ? parseInt(max_discount) : null,
        max_uses: max_uses ? parseInt(max_uses) : null,
        expires_at: expires_at || null,
        description: description || null,
      })
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
    const { id, code, type, value, min_order_amount, max_discount, max_uses, is_active, expires_at, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("coupons")
      .update({
        code: code?.toUpperCase(),
        type,
        value: value ? parseInt(value) : undefined,
        min_order_amount: min_order_amount !== undefined ? parseInt(min_order_amount) : undefined,
        max_discount: max_discount !== undefined ? parseInt(max_discount) : undefined,
        max_uses: max_uses !== undefined ? parseInt(max_uses) : undefined,
        is_active,
        expires_at: expires_at !== undefined ? expires_at : undefined,
        description,
      })
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
    return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
  }

  const { error } = await getApiSupabase().from("coupons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
