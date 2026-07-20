import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, reviewSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const { data, error } = await getApiSupabase()
    .from("reviews")
    .select("*, users(name)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await getApiSupabase().auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = validate(reviewSchema, body);
    if ("error" in validated) return validated.error;
    const { product_id, rating, title, body: reviewBody } = validated.data;

    const { data: existing } = await getApiSupabase()
      .from("reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }

    const { data: hasOrdered } = await getApiSupabase()
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: review, error } = await getApiSupabase()
      .from("reviews")
      .insert({
        product_id,
        user_id: user.id,
        rating,
        title: title || null,
        body: reviewBody,
        verified_purchase: !!hasOrdered,
        is_approved: false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
