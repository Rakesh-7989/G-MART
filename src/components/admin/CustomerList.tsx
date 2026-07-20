"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

interface CustomerListProps {
  token: string;
}

export default function CustomerList({ token }: CustomerListProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line px-4 py-2 text-sm text-ink"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 bg-[#efefef]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">
          {search ? "No customers match your search." : "No registered customers yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">Orders</th>
                <th className="text-left px-4 py-3 font-medium">Total Spent</th>
                <th className="text-left px-4 py-3 font-medium">Last Order</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 text-ink font-medium">{customer.name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{customer.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {customer.lastOrder
                      ? new Date(customer.lastOrder).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(customer.created_at).toLocaleDateString("en-IN")}
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
