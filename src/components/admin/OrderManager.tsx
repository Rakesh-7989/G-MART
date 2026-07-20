"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

interface OrderManagerProps {
  token: string;
}

export default function OrderManager({ token }: OrderManagerProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; url: string }>>({});

  useEffect(() => {
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (paymentFilter !== "all") {
      result = result.filter((o) => o.payment_method === paymentFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, paymentFilter, orders]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data || []);
      setFiltered(data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function updateOrder(id: string, data: { status?: string; tracking_number?: string; tracking_url?: string }) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    fetchOrders();
  }

  function handleTrackingChange(orderId: string, field: "number" | "url", value: string) {
    setTrackingInputs((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  }

  const statuses = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by order ID, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line px-4 py-2 text-sm text-ink"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Status" : s}</option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          <option value="all">All Payments</option>
          <option value="cod">COD</option>
          <option value="cashfree">Cashfree</option>
          <option value="emi">EMI</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 bg-[#efefef]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No orders match your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
                <th className="text-left px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Payment</th>
                <th className="text-left px-4 py-3 font-medium">Tracking</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 font-mono text-xs text-ink">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink text-sm">{order.customer_name}</p>
                    <p className="text-muted text-xs">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{order.order_items?.length || 0}</td>
                  <td className="px-4 py-3 text-ink font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${
                      order.payment_method === "cashfree" ? "bg-blue-100 text-blue-700" : order.payment_method === "emi" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.payment_method.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {order.tracking_number ? (
                      <div>
                        <p className="text-ink">{order.tracking_number}</p>
                        {order.tracking_url && (
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-terracotta">Track</a>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus === "shipped" && !order.tracking_number) {
                            const input = trackingInputs[order.id] || { number: "", url: "" };
                            if (!input.number) {
                              alert("Please enter a tracking number below before marking as shipped.");
                              return;
                            }
                            updateOrder(order.id, { status: newStatus, tracking_number: input.number, tracking_url: input.url || undefined });
                          } else {
                            updateOrder(order.id, { status: newStatus });
                          }
                        }}
                        className="border border-line p-1 text-xs w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Tracking #"
                          value={(trackingInputs[order.id]?.number || order.tracking_number || "")}
                          onChange={(e) => handleTrackingChange(order.id, "number", e.target.value)}
                          className="border border-line p-1 text-[10px] w-full"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={(trackingInputs[order.id]?.url || order.tracking_url || "")}
                          onChange={(e) => handleTrackingChange(order.id, "url", e.target.value)}
                          className="border border-line p-1 text-[10px] w-full"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
