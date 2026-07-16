import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await getApiSupabase()
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
