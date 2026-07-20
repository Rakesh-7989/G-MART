import { NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await getApiSupabase()
      .from("products")
      .select("*, categories(name, slug), product_variants(*)")
      .eq("slug", params.slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Sort variants: default first, then by sort_order
    if (data.product_variants) {
      data.product_variants.sort((a: any, b: any) => {
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        return a.sort_order - b.sort_order;
      });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
