import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email } = body;
    if (!orderId || !email) {
      return NextResponse.json({ error: "Order ID and email are required" }, { status: 400 });
    }

    const { data: order, error } = await getServiceRoleSupabase()
      .from("orders")
      .select("*, order_items:order_items(*, product:products(name))")
      .eq("id", orderId)
      .eq("customer_email", email.toLowerCase().trim())
      .single();

    if (error || !order) {
      console.error("Track order error:", error);
      return NextResponse.json({ error: "Order not found. Check your order ID and email." }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
      items: order.order_items?.map((item: any) => ({
        name: item.product?.name || "Product",
        quantity: item.quantity,
        price: item.price,
      })) || [],
    });
  } catch (err) {
    console.error("Track order error:", err);
    return NextResponse.json({ error: "Invalid request", details: err instanceof Error ? err.message : String(err) }, { status: 400 });
  }
}
