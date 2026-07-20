import { Product } from "./types";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getProducts(params?: {
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  material?: string;
  color?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  const sp = new URLSearchParams();
  if (params?.category && params.category !== "all") sp.set("category", params.category);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.minPrice) sp.set("minPrice", params.minPrice);
  if (params?.maxPrice) sp.set("maxPrice", params.maxPrice);
  if (params?.material) sp.set("material", params.material);
  if (params?.color) sp.set("color", params.color);
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));

  const qs = sp.toString();
  const res = await fetch(`${BASE}/api/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return { products: [], total: 0, page: 1, totalPages: 0 };
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/api/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*, categories(name, slug)")
      .eq("featured", true)
      .limit(12);
    if (error || !data) return [];
    return (data as any[]).map((p) => ({
      ...p,
      category: p.categories || p.category || null,
    })) as unknown as Product[];
  } catch {
    return [];
  }
}

export async function searchProducts(q: string): Promise<Product[]> {
  if (!q.trim()) return [];
  const res = await fetch(`${BASE}/api/products/search?q=${encodeURIComponent(q)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getCategories(): Promise<{ name: string; slug: string }[]> {
  const res = await fetch(`${BASE}/api/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}

export async function placeOrder(body: {
  items: { productId: string; name: string; price: number; quantity: number }[];
  customer: { name: string; email: string; phone?: string };
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
  paymentMethod: string;
  total: number;
  couponCode?: string;
  discount?: number;
}) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
