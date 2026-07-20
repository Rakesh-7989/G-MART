import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Search | G-MART",
  description: "Search our collection of premium handcrafted furniture.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || "";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1"));

  if (!query.trim()) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-ink font-bold mb-4">Search</h1>
        <p className="text-muted">Enter a search term to find products.</p>
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=24`,
    { next: { revalidate: 60 } },
  );
  const products = res.ok ? await res.json() : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-terracotta uppercase tracking-[0.2em] text-xs mb-2 font-medium">Search</p>
        <h1 className="text-3xl text-ink font-bold">
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-muted text-sm mt-1">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">No products found for your search.</p>
          <Link href="/products" className="btn-primary">Browse All Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
