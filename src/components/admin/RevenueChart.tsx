"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  token: string;
}

export default function RevenueChart({ token }: RevenueChartProps) {
  const [period, setPeriod] = useState("7d");
  const [data, setData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/revenue?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json.chartData || []);
      setTotalRevenue(json.totalRevenue || 0);
      setTotalOrders(json.totalOrders || 0);
    } catch { /* ignore */ }
    setLoading(false);
  }

  const periods = [
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "90d", label: "90 Days" },
    { key: "1y", label: "1 Year" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#efefef] p-4">
          <p className="text-2xl font-bold text-ink">₹{(totalRevenue / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted mt-1">Revenue ({period})</p>
        </div>
        <div className="bg-[#efefef] p-4">
          <p className="text-2xl font-bold text-ink">{totalOrders}</p>
          <p className="text-xs text-muted mt-1">Orders ({period})</p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {periods.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-3 py-1 text-xs transition-colors ${
              period === key
                ? "bg-terracotta text-white"
                : "bg-[#efefef] text-muted hover:bg-line"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-48 animate-pulse bg-[#efefef]" />
      ) : data.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No revenue data for this period.</p>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e7" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#686868" }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#686868" }} />
              <Tooltip
                formatter={(value: any) => [`₹${((value || 0) / 100).toLocaleString("en-IN")}`, "Revenue"]}
                labelFormatter={(label: any) => new Date(label).toLocaleDateString("en-IN")}
              />
              <Bar dataKey="revenue" fill="#cf542f" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
