"use client";

import { useState } from "react";

interface CashfreeInstance {
  checkout: (options: { paymentSessionId: string; redirectTarget: string }) => void;
}

declare global {
  interface Window {
    Cashfree?: new (config: { mode: string }) => CashfreeInstance;
  }
}

interface CashfreeCheckoutProps {
  orderId: string;
  amount: number;
  customer: { name: string; email: string; phone?: string };
  paymentMethod?: string;
  onSuccess: () => void;
  onError: () => void;
}

export default function CashfreeCheckout({
  orderId,
  amount,
  customer,
  paymentMethod,
  onSuccess,
  onError,
}: CashfreeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  async function handlePayNow() {
    setLoading(true);

    const res = await fetch("/api/payments/cashfree-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderAmount: amount, customer, paymentMethod }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.payment_session_id && window.Cashfree) {
      const cf = new window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" ? "production" : "sandbox",
      });
      cf.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } else if (data.fallback === "cod") {
      onSuccess();
    } else {
      onError();
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayNow}
      disabled={loading}
      className="btn-primary w-full disabled:opacity-50"
    >
      {loading ? "Connecting to Payment Gateway..." : `Pay \u20B9${(amount / 100).toLocaleString("en-IN")}`}
    </button>
  );
}
