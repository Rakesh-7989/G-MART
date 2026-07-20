import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET() {
  const { data: posts } = await getApiSupabase()
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json(posts || []);
}
