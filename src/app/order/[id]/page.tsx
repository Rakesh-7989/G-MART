"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchOrder() {
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch("/api/orders", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const orders: any[] = await res.json();
        const found = orders.find((o) => o.id === id);
        if (found) setOrder(found);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">Success</p>
      <h1 className="text-3xl text-ink font-bold mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-muted mb-2">
        Your order <span className="font-mono text-terracotta font-medium">{id}</span> has been confirmed.
      </p>
      <p className="text-muted mb-2">
        Thank you for shopping at G-MART. You will receive an email confirmation shortly.
      </p>

      {order && (
        <div className="bg-[#efefef] p-6 text-left mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Order Summary</h2>
            <span className={`text-xs px-3 py-1 ${
              order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {order.status}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {order.order_items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ink">{item.product_name} <span className="text-muted">×{item.quantity}</span></span>
                <span className="text-ink font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-3 flex justify-between font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>Payment</span>
            <span className="font-medium text-ink">
              {order.payment_method === "emi" ? "EMI" : order.payment_method === "cashfree" ? "Online" : "COD"}
            </span>
          </div>
          {order.payment_method === "emi" && order.payment_data && (
            <div className="bg-purple-50 border border-purple-200 p-3 mt-3 text-xs text-purple-800">
              {order.payment_data.emi_tenure && (
                <p>Tenure: <strong>{order.payment_data.emi_tenure} months</strong></p>
              )}
              {order.payment_data.emi_bank_name && (
                <p>Bank: <strong>{order.payment_data.emi_bank_name}</strong></p>
              )}
              {order.payment_data.emi_monthly_amount && (
                <p>Monthly: <strong>{formatPrice(order.payment_data.emi_monthly_amount)}</strong></p>
              )}
            </div>
          )}
          {order.coupon_code && (
            <div className="flex justify-between text-xs text-muted mt-2">
              <span>Coupon: {order.coupon_code}</span>
              {order.discount > 0 && <span className="text-green-700">-{formatPrice(order.discount)}</span>}
            </div>
          )}
          {order.tracking_number && (
            <div className="border-t border-line mt-4 pt-4 text-sm">
              <p className="text-muted mb-1">Tracking: <span className="text-ink font-medium">{order.tracking_number}</span></p>
              {order.tracking_url && (
                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-terracotta text-sm hover:underline">
                  Track Your Order →
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <a
          href={`/api/invoice/${id}`}
          download
          className="btn-primary"
        >
          Download Invoice
        </a>
        <Link href="/products" className="btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
