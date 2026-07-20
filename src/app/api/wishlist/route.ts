import { NextRequest, NextResponse } from "next/server";
import { getApiSupabase } from "@/lib/supabase";
import { validate, wishlistSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ products: [], ids: [] });
  }

  const token = authHeader.slice(7);
  const supabase = getApiSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ products: [], ids: [] });
  }

  const { data: wishlistData, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = (wishlistData || []).map((w: any) => w.product_id);

  if (ids.length === 0) {
    return NextResponse.json({ products: [], ids: [] });
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .in("id", ids);

  return NextResponse.json({ products: products || [], ids });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = getApiSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validated = validate(wishlistSchema, body);
  if ("error" in validated) return validated.error;
  const { productId } = validated.data;

  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: user.id, product_id: productId })
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
