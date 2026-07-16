import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { data, error } = await getApiSupabase()
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
