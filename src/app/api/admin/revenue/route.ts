import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    let days: number;
    if (period === "30d") days = 30;
    else if (period === "90d") days = 90;
    else if (period === "1y") days = 365;
    else days = 7;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: orders, error } = await getApiSupabase()
      .from("orders")
      .select("total, created_at, status")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const revenueByDay: Record<string, number> = {};
    const orderCountByDay: Record<string, number> = {};

    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      revenueByDay[key] = 0;
      orderCountByDay[key] = 0;
    }

    for (const order of orders || []) {
      const key = order.created_at.slice(0, 10);
      if (revenueByDay[key] !== undefined) {
        revenueByDay[key] += order.total || 0;
        orderCountByDay[key]++;
      }
    }

    const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
      orders: orderCountByDay[date] || 0,
    }));

    return NextResponse.json({
      chartData,
      totalRevenue: orders?.reduce((s, o) => s + (o.total || 0), 0) || 0,
      totalOrders: orders?.length || 0,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
