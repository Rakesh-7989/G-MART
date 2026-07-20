import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await getApiSupabase().auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { order_id, reason } = body;

    if (!order_id || !reason) {
      return NextResponse.json({ error: "Order ID and reason are required" }, { status: 400 });
    }

    const { data: order } = await getApiSupabase()
      .from("orders")
      .select("id, status, user_id")
      .eq("id", order_id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "This order does not belong to you" }, { status: 403 });
    }

    if (order.status !== "delivered") {
      return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
    }

    const { data: existing } = await getApiSupabase()
      .from("return_requests")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "A return request already exists for this order" }, { status: 409 });
    }

    const { data: returnReq, error } = await getApiSupabase()
      .from("return_requests")
      .insert({ order_id, user_id: user.id, reason })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(returnReq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
