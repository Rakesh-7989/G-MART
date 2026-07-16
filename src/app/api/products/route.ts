import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = getApiSupabase()
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("categories.slug", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
