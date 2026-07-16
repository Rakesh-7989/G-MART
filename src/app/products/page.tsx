import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category || "all";
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase().replace(/\s+/g, "-") === activeCategory
        );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-luxury-brown mb-4">Our Collection</h1>
        <div className="w-16 h-0.5 bg-luxury-gold mx-auto" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
            className={`px-6 py-2 text-sm uppercase tracking-wider transition-colors ${
              activeCategory === cat.slug
                ? "bg-luxury-gold text-white"
                : "border border-luxury-gold/30 text-luxury-brown hover:bg-luxury-gold/10"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-luxury-brown/60 py-20">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
