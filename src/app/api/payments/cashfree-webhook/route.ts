import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { sendOrderStatusUpdate } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    const signature = request.headers.get("x-webhook-signature");
    const secret = process.env.CASHFREE_SECRET_KEY;

    if (secret && signature) {
      const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("base64");

      if (signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const { order_id, order_status, payment_method, payment_group } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const paymentStatus = order_status === "PAID" ? "paid" : "failed";

    // Extract EMI-specific data if the payment was made via EMI
    const paymentData: Record<string, any> = {};
    if (payment_group === "emi" || payment_method === "emi") {
      paymentData.payment_group = payment_group || "emi";
      paymentData.payment_method = payment_method;
      if (body.emi_tenure) paymentData.emi_tenure = body.emi_tenure;
      if (body.emi_amount) paymentData.emi_amount = body.emi_amount;
      if (body.emi_bank_name) paymentData.emi_bank_name = body.emi_bank_name;
      if (body.emi_monthly_amount) paymentData.emi_monthly_amount = body.emi_monthly_amount;
    }

    const updateData: Record<string, any> = {
      payment_status: paymentStatus,
      status: paymentStatus === "paid" ? "confirmed" : "cancelled",
    };

    if (Object.keys(paymentData).length > 0) {
      updateData.payment_data = paymentData;
    }

    await getApiSupabase()
      .from("orders")
      .update(updateData)
      .eq("id", order_id);

    const { data: order } = await getApiSupabase()
      .from("orders")
      .select("customer_name, customer_email")
      .eq("id", order_id)
      .single();

    if (order) {
      sendOrderStatusUpdate({
        id: order_id,
        customer_name: order.customer_name || "Customer",
        customer_email: order.customer_email,
        status: paymentStatus === "paid" ? "confirmed" : "cancelled",
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
