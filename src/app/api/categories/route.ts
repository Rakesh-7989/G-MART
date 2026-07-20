import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await getApiSupabase()
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
