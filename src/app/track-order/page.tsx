"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!orderId || !email) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      const data = await res.json();
      if (res.ok) setOrder(data);
      else setError(data.error || "Order not found");
    } catch {
      setError("Failed to lookup order");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Support</p>
        <h1 className="text-3xl text-ink font-bold">Track Your Order</h1>
        <p className="text-muted text-sm mt-3">Enter your order ID and email to check the status.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mb-12">
        <input
          type="text" placeholder="Order ID" value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm"
        />
        <input
          type="email" placeholder="Email used during order" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Looking up..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="border border-line p-6 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted uppercase tracking-wider">Status</span>
            <span className={`text-sm font-semibold ${
              order.status === "delivered" ? "text-green-600" :
              order.status === "cancelled" ? "text-red-500" :
              order.status === "shipped" || order.status === "confirmed" ? "text-terracotta" :
              "text-muted"
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="text-sm text-muted space-y-2">
            <p><span className="text-ink font-medium">Order:</span> {order.id}</p>
            <p><span className="text-ink font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><span className="text-ink font-medium">Total:</span> ₹{Number(order.total).toLocaleString()}</p>
            {order.tracking_number && (
              <p><span className="text-ink font-medium">Tracking:</span> {order.tracking_number}</p>
            )}
            {order.tracking_url && (
              <p>
                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                  className="text-terracotta hover:underline text-xs">
                  Track via Courier &rarr;
                </a>
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-line">
            <p className="text-xs text-muted mb-2">Items</p>
            {order.items?.map((item: any, i: number) => (
              <p key={i} className="text-sm text-ink">{item.name} × {item.quantity}</p>
            ))}
          </div>
        </div>
      )}

      <p className="text-center mt-8">
        <Link href="/contact" className="text-terracotta hover:underline text-sm">
          Need help? Contact support
        </Link>
      </p>
    </div>
  );
}
