import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { data, error } = await getApiSupabase()
    .from("return_requests")
    .select("*, orders(customer_name, customer_email, total, status)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  try {
    const body = await request.json();
    const { id, status, admin_note, refund_amount } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const { data, error } = await getApiSupabase()
      .from("return_requests")
      .update({ status, admin_note: admin_note || null, refund_amount: refund_amount || null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
