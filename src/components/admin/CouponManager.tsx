"use client";

import { useState, useEffect } from "react";

export default function CouponManager({ token }: { token: string }) {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: "", min_order_amount: "",
    max_discount: "", max_uses: "", expires_at: "", description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => { fetchCoupons(); }, []); // eslint-disable-line

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCoupons(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  function resetForm() {
    setForm({ code: "", type: "percentage", value: "", min_order_amount: "", max_discount: "", max_uses: "", expires_at: "", description: "" });
    setEditing(null);
    setError("");
  }

  function editCoupon(c: any) {
    setForm({
      code: c.code, type: c.type, value: c.value.toString(),
      min_order_amount: c.min_order_amount?.toString() || "",
      max_discount: c.max_discount?.toString() || "",
      max_uses: c.max_uses?.toString() || "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : "",
      description: c.description || "",
    });
    setEditing(c);
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const url = "/api/admin/coupons";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchCoupons();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch { setError("Failed to save"); }
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, is_active: !current }),
    });
    fetchCoupons();
  }

  async function deleteCoupon(id: string) {
    await fetch(`/api/admin/coupons?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCoupons();
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-12 bg-[#efefef]" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-ink text-xl">Coupons</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">
          Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-[#efefef] p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-ink">{editing ? "Edit Coupon" : "New Coupon"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Code *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" required />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink bg-white">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Value *</label>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" required />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Max Discount</label>
              <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Min Order</label>
              <input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted block mb-1">Expires At</label>
              <input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-line px-3 py-2 text-sm text-ink" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-outline text-sm">Cancel</button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <p className="text-muted text-sm">No coupons yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Value</th>
                <th className="text-left px-4 py-3 font-medium">Uses</th>
                <th className="text-left px-4 py-3 font-medium">Expires</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 font-mono text-ink font-medium">{c.code}</td>
                  <td className="px-4 py-3 text-muted">{c.type}</td>
                  <td className="px-4 py-3 text-ink">{c.type === "percentage" ? `${c.value}%` : `₹${c.value.toLocaleString("en-IN")}`}</td>
                  <td className="px-4 py-3 text-muted">{c.used_count}/{c.max_uses || "∞"}</td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c.id, c.is_active)}
                      className={`text-xs px-2 py-0.5 ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => editCoupon(c)} className="text-xs text-terracotta hover:underline">Edit</button>
                      <button onClick={() => deleteCoupon(c.id)} className="text-xs text-red-500 hover:underline">Delete</button>
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
