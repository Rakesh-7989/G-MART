import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: order } = await getApiSupabase()
      .from("orders")
      .select("id, user_id, status, order_items(product_id, quantity)")
      .eq("id", params.id)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "This order does not belong to you" }, { status: 403 });
    }

    if (order.status !== "pending" && order.status !== "confirmed") {
      return NextResponse.json({ error: "Only pending or confirmed orders can be cancelled" }, { status: 400 });
    }

    await getApiSupabase()
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", params.id);

    for (const item of order.order_items || []) {
      const { data: product } = await getApiSupabase()
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();

      if (product) {
        await getApiSupabase()
          .from("products")
          .update({
            stock_quantity: (product.stock_quantity || 0) + item.quantity,
            in_stock: true,
          })
          .eq("id", item.product_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
