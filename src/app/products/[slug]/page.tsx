import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getFeaturedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-luxury-brown mb-4">Product Not Found</h1>
        <Link href="/products" className="btn-primary">Back to Collection</Link>
      </div>
    );
  }

  const related = getFeaturedProducts().filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-[3/4] bg-luxury-brown/5">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-luxury-gold uppercase tracking-[0.2em] text-sm mb-3">
            {product.category}
          </p>
          <h1 className="font-serif text-4xl text-luxury-brown mb-4">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-serif text-luxury-brown">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-luxury-brown/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-luxury-gold">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-luxury-brown/60">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-luxury-brown/70 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            {product.material && (
              <div>
                <span className="text-luxury-brown/40 uppercase tracking-wider">Material</span>
                <p className="text-luxury-brown mt-1">{product.material}</p>
              </div>
            )}
            {product.dimensions && (
              <div>
                <span className="text-luxury-brown/40 uppercase tracking-wider">Dimensions</span>
                <p className="text-luxury-brown mt-1">{product.dimensions}</p>
              </div>
            )}
            {product.color && (
              <div>
                <span className="text-luxury-brown/40 uppercase tracking-wider">Color</span>
                <p className="text-luxury-brown mt-1">{product.color}</p>
              </div>
            )}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-luxury-brown mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
