import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const denied = await requireAdmin(request);
    if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });

    const { data: users, error } = await getApiSupabase()
      .from("users")
      .select("id, name, phone, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const customers = await Promise.all(
      (users || []).map(async (user: any) => {
        const { data: orders } = await getApiSupabase()
          .from("orders")
          .select("id, total, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        return {
          ...user,
          orderCount: orders?.length || 0,
          totalSpent: orders?.reduce((s: number, o: any) => s + (o.total || 0), 0) || 0,
          lastOrder: orders?.[0]?.created_at || null,
        };
      })
    );

    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
