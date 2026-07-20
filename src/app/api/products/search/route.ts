import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") || "24")));

  if (!q) {
    return NextResponse.json([]);
  }

  const supabase = getApiSupabase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("products")
    .select("*, categories!inner(name, slug)")
    .or(`name.ilike.%${q}%,description.ilike.%${q}%,material.ilike.%${q}%,color.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
