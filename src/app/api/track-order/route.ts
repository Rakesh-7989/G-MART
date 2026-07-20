import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email } = body;
    if (!orderId || !email) {
      return NextResponse.json({ error: "Order ID and email are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = getServiceRoleSupabase();

    // First, try a simple query without relations
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("customer_email", normalizedEmail)
      .single();

    if (error || !order) {
      console.error("Track order error:", error);
      return NextResponse.json({ 
        error: "Order not found. Check your order ID and email.",
        debug: { orderId, normalizedEmail, errorMessage: error?.message, errorCode: error?.code, hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY }
      }, { status: 404 });
    }

    // Get order items separately
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name)")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Track order items error:", itemsError);
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
      items: orderItems?.map((item: any) => ({
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
