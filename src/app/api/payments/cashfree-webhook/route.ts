import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, order_status } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const paymentStatus = order_status === "PAID" ? "paid" : "failed";

    await getApiSupabase()
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: paymentStatus === "paid" ? "confirmed" : "cancelled",
      })
      .eq("id", order_id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
