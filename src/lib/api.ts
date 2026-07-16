import { Product } from "./types";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getProducts(category?: string): Promise<Product[]> {
  const params = category && category !== "all" ? `?category=${category}` : "";
  const res = await fetch(`${BASE}/api/products${params}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${BASE}/api/products/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

export async function getCategories(): Promise<{ name: string; slug: string }[]> {
  const res = await fetch(`${BASE}/api/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function placeOrder(body: {
  items: { productId: string; name: string; price: number; quantity: number }[];
  customer: { name: string; email: string; phone?: string };
  shippingAddress: { line1: string; line2?: string; city: string; state: string; pincode: string };
  paymentMethod: string;
  total: number;
}) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
