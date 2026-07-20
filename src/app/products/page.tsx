import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductSort from "@/components/ProductSort";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products | G-MART | Premium Furniture",
  description: "Browse our curated collection of premium handcrafted furniture. Living room, bedroom, dining, and more.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    material?: string;
    color?: string;
    page?: string;
  };
}) {
  const activeCategory = searchParams.category || "all";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1"));

  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts({
      category: activeCategory,
      sort: searchParams.sort,
      minPrice: searchParams.minPrice,
      maxPrice: searchParams.maxPrice,
      material: searchParams.material,
      color: searchParams.color,
      page: currentPage,
    }),
    getCategories(),
  ]);

  const categoryName =
    activeCategory === "all"
      ? "All"
      : categories.find((c) => c.slug === activeCategory)?.name || "All";

  return (
    <div>
      {/* Collection Hero */}
      <div className="relative h-48 md:h-64 bg-ink overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&h=400&fit=crop)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <div className="relative h-full flex items-center justify-center">
          <h1
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ color: "var(--collection-hero-title-color, #ffffff)" }}
          >
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link
            key="all"
            href="/products"
            className={`px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-ink text-white"
                : "bg-[#efefef] text-ink hover:bg-line"
            }`}
            style={{ borderRadius: "var(--radius-button)" }}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-ink text-white"
                  : "bg-[#efefef] text-ink hover:bg-line"
              }`}
              style={{ borderRadius: "var(--radius-button)" }}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-8">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted">
                {total} product{total !== 1 ? "s" : ""}
              </p>
              <Suspense fallback={null}>
                <ProductSort />
              </Suspense>
            </div>

            {products.length === 0 ? (
              <p className="text-center text-muted py-20">No products found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Suspense fallback={null}>
              <Pagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
