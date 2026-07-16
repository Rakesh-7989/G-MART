import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await getApiSupabase()
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
