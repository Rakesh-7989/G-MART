import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount } = await request.json();

    if (!code || !orderAmount) {
      return NextResponse.json({ error: "Code and order amount required" }, { status: 400 });
    }

    const { data: coupon, error } = await getApiSupabase()
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.is_active) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (orderAmount < coupon.min_order_amount) {
      return NextResponse.json({
        error: `Minimum order amount of ₹${coupon.min_order_amount.toLocaleString("en-IN")} required`,
      }, { status: 400 });
    }

    let discount = coupon.type === "percentage"
      ? Math.round(orderAmount * coupon.value / 100)
      : coupon.value;

    if (coupon.max_discount) {
      discount = Math.min(discount, coupon.max_discount);
    }

    discount = Math.min(discount, orderAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
        description: coupon.description,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
