import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderAmount, customer, paymentMethod } = await request.json();

    if (!orderId || !orderAmount || !customer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENVIRONMENT || "TEST";

    if (!appId || !secretKey) {
      return NextResponse.json(
        {
          error: "Cashfree not configured",
          fallback: "cod",
          payment_session_id: null,
        },
        { status: 200 }
      );
    }

    const apiUrl =
      env === "PRODUCTION"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    const orderPayload: Record<string, any> = {
      order_id: orderId,
      order_amount: orderAmount / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9]/g, "_"),
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || "9999999999",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/order/${orderId}?payment_status=completed`,
      },
    };

    // When EMI is selected, restrict payment methods to EMI
    if (paymentMethod === "emi") {
      orderPayload.order_tags = { payment_method: "emi" };
      orderPayload.payment_methods = "emi";
    }

    const cashfreeRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await cashfreeRes.json();

    if (!cashfreeRes.ok) {
      return NextResponse.json({ error: data.message, fallback: "cod" }, { status: 200 });
    }

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
    });
  } catch {
    return NextResponse.json({ error: "Payment service unavailable", fallback: "cod" }, { status: 200 });
  }
}
