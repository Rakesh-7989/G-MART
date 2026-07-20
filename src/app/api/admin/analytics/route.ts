import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";

  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[period] || 30;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  try {
    const [topProductsRes, categoryBreakdownRes, orderStatusRes] = await Promise.all([
      getApiSupabase()
        .from("order_items")
        .select("product_name, quantity, price, orders!inner(created_at)")
        .gte("orders.created_at", since)
        .order("quantity", { ascending: false })
        .limit(10),
      getApiSupabase()
        .from("products")
        .select("categories(name)"),
      getApiSupabase()
        .from("orders")
        .select("status")
        .gte("created_at", since),
    ]);

    const productMap = new Map<string, { qty: number; revenue: number }>();
    (topProductsRes.data || []).forEach((item: any) => {
      const existing = productMap.get(item.product_name) || { qty: 0, revenue: 0 };
      existing.qty += item.quantity;
      existing.revenue += item.price * item.quantity;
      productMap.set(item.product_name, existing);
    });

    const topProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 10)
      .map(([name, data]) => ({ name, quantity: data.qty, revenue: data.revenue }));

    const catMap = new Map<string, number>();
    (categoryBreakdownRes.data || []).forEach((p: any) => {
      const catName = p.categories?.name || "Uncategorized";
      catMap.set(catName, (catMap.get(catName) || 0) + 1);
    });
    const categoryBreakdown = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));

    const statusCounts: Record<string, number> = {};
    (orderStatusRes.data || []).forEach((o: any) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const orderStatusDistribution = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    return NextResponse.json({
      topProducts,
      categoryBreakdown,
      orderStatusDistribution,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
