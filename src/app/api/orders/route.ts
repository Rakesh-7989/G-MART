import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, shippingAddress, paymentMethod, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { data: order, error: orderError } = await getApiSupabase()
      .from("orders")
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod || "cod",
        total,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderItems = items.map(
      (item: { productId: string; productName?: string; name: string; price: number; quantity: number }) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName || item.name,
        price: item.price,
        quantity: item.quantity,
      })
    );

    const { error: itemsError } = await getApiSupabase()
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ order, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
