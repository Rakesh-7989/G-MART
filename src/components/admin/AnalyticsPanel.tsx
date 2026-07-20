"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function AnalyticsPanel({ token }: { token: string }) {
  const [data, setData] = useState<{
    topProducts: { name: string; quantity: number; revenue: number }[];
    categoryBreakdown: { name: string; count: number }[];
    orderStatusDistribution: { status: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics?period=30d", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null;

  const totalOrders = data.orderStatusDistribution.reduce((s, o) => s + o.count, 0);
  const totalProducts = data.categoryBreakdown.reduce((s, c) => s + c.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
      {/* Top Products */}
      <div className="bg-[#efefef] p-6">
        <h3 className="font-bold text-ink text-sm mb-4 uppercase tracking-wider">Top Products (30d)</h3>
        {data.topProducts.length === 0 ? (
          <p className="text-muted text-xs">No data</p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted w-4 flex-shrink-0">{i + 1}.</span>
                  <span className="text-ink truncate">{p.name}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-ink font-medium">{p.quantity} sold</span>
                  <span className="text-muted text-xs block">{formatPrice(p.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-[#efefef] p-6">
        <h3 className="font-bold text-ink text-sm mb-4 uppercase tracking-wider">Categories ({totalProducts})</h3>
        {data.categoryBreakdown.length === 0 ? (
          <p className="text-muted text-xs">No data</p>
        ) : (
          <div className="space-y-2">
            {data.categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-ink">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-white h-2">
                    <div className="bg-terracotta h-2" style={{ width: `${(c.count / totalProducts) * 100}%` }} />
                  </div>
                  <span className="text-muted text-xs w-6 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Status Distribution */}
      <div className="bg-[#efefef] p-6">
        <h3 className="font-bold text-ink text-sm mb-4 uppercase tracking-wider">Orders ({totalOrders})</h3>
        {data.orderStatusDistribution.length === 0 ? (
          <p className="text-muted text-xs">No data</p>
        ) : (
          <div className="space-y-3">
            {data.orderStatusDistribution.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <span className="text-ink capitalize">{s.status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-white h-2">
                    <div className={`h-2 ${
                      s.status === "delivered" ? "bg-green-500" :
                      s.status === "shipped" ? "bg-yellow-500" :
                      s.status === "confirmed" ? "bg-blue-500" :
                      s.status === "cancelled" ? "bg-red-500" :
                      "bg-gray-500"
                    }`} style={{ width: `${(s.count / totalOrders) * 100}%` }} />
                  </div>
                  <span className="text-muted text-xs w-6 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
