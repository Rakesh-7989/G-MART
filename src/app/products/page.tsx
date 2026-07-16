import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category || "all";
  const [products, categories] = await Promise.all([
    getProducts(activeCategory),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-luxury-brown mb-4">Our Collection</h1>
        <div className="w-16 h-0.5 bg-luxury-gold mx-auto" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          key="all"
          href="/products"
          className={`px-6 py-2 text-sm uppercase tracking-wider transition-colors ${
            activeCategory === "all"
              ? "bg-luxury-gold text-white"
              : "border border-luxury-gold/30 text-luxury-brown hover:bg-luxury-gold/10"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`px-6 py-2 text-sm uppercase tracking-wider transition-colors ${
              activeCategory === cat.slug
                ? "bg-luxury-gold text-white"
                : "border border-luxury-gold/30 text-luxury-brown hover:bg-luxury-gold/10"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-luxury-brown/60 py-20">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
