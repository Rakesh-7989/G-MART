"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function ReturnManager({ token }: { token: string }) {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReturns(); }, []); // eslint-disable-line

  async function fetchReturns() {
    try {
      const res = await fetch("/api/admin/returns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setReturns(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, admin_note?: string, refund_amount?: number) {
    await fetch("/api/admin/returns", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status, admin_note: admin_note || null, refund_amount: refund_amount || null }),
    });
    fetchReturns();
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-16 bg-[#efefef]" />)}</div>;

  return (
    <div>
      <h2 className="font-bold text-ink text-xl mb-6">Return Requests</h2>
      {returns.length === 0 ? (
        <p className="text-muted text-sm">No return requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Reason</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r: any) => (
                <tr key={r.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 font-mono text-xs text-ink">#{r.order_id?.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink text-sm">{r.orders?.customer_name}</p>
                    <p className="text-muted text-xs">{r.orders?.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted max-w-xs">
                    <p className="truncate">{r.reason}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${
                      r.status === "approved" ? "bg-blue-100 text-blue-700" :
                      r.status === "refunded" ? "bg-green-100 text-green-700" :
                      r.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(r.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "approved")}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "rejected")}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {r.status === "approved" && (
                      <button
                        onClick={() => {
                          const amount = prompt("Refund amount (₹):", r.orders?.total?.toString() || "0");
                          if (amount) updateStatus(r.id, "refunded", undefined, parseInt(amount));
                        }}
                        className="text-xs text-green-600 hover:underline"
                      >
                        Mark Refunded
                      </button>
                    )}
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
