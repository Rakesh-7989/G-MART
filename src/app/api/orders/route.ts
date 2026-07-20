import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, orderSchema } from "@/lib/validation";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET(request: NextRequest) {
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

    const { data, error } = await getApiSupabase()
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validate(orderSchema, body);
    if ("error" in validated) return validated.error;
    const { items, customer, shippingAddress, paymentMethod, total } = validated.data;

    let userId: string | null = null;
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await getApiSupabase().auth.getUser(token);
      if (user) userId = user.id;
    }

    const orderInsert: Record<string, any> = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: shippingAddress,
      payment_method: paymentMethod || "cod",
      total,
      coupon_code: validated.data.couponCode || null,
      discount: validated.data.discount || 0,
    };
    if (userId) orderInsert.user_id = userId;

    const { data: order, error: orderError } = await getApiSupabase()
      .from("orders")
      .insert(orderInsert)
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

    for (const item of orderItems) {
      const { data: product } = await getApiSupabase()
        .from("products")
        .select("stock_quantity, in_stock")
        .eq("id", item.product_id)
        .single();

      if (!product || !product.in_stock || (product.stock_quantity !== null && product.stock_quantity < item.quantity)) {
        return NextResponse.json({
          error: `Insufficient stock for ${item.product_name}`,
        }, { status: 409 });
      }

      await getApiSupabase()
        .from("products")
        .update({
          stock_quantity: product.stock_quantity - item.quantity,
          in_stock: (product.stock_quantity - item.quantity) > 0,
        })
        .eq("id", item.product_id);
    }

    const { error: itemsError } = await getApiSupabase()
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const fullOrder = {
      ...order,
      payment_status: "pending",
      order_items: orderItems,
    };

    if (validated.data.couponCode) {
      const { data: coupon } = await getApiSupabase()
        .from("coupons")
        .select("used_count")
        .eq("code", validated.data.couponCode)
        .single();
      if (coupon) {
        await getApiSupabase()
          .from("coupons")
          .update({ used_count: (coupon.used_count || 0) + 1 })
          .eq("code", validated.data.couponCode);
      }
    }

    sendOrderConfirmation(fullOrder).catch(() => {});

    return NextResponse.json({ order, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
