import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const material = searchParams.get("material");
  const color = searchParams.get("color");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
  const offset = (page - 1) * limit;

  let query = getApiSupabase()
    .from("products")
    .select("*, categories(name, slug)", { count: "exact" });

  if (category && category !== "all") {
    query = query.eq("categories.slug", category);
  }

  if (minPrice) {
    query = query.gte("price", parseInt(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseInt(maxPrice));
  }
  if (material) {
    query = query.eq("material", material);
  }
  if (color) {
    query = query.eq("color", color);
  }

  switch (sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    case "name-desc":
      query = query.order("name", { ascending: false });
      break;
    case "featured":
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "best-selling":
      query = query.order("review_count", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: data,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150",
    },
  });
}
