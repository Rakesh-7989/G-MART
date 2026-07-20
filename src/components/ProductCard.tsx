import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-ink text-xs">
      {rating.toFixed(1)} ★★★★★
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const salePercent = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="product-card--classic group">
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="product-card-media relative overflow-hidden bg-card-bg"
          style={{ aspectRatio: "4/5" }}
        >
          <Image
            src={product.images?.[0] ?? "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:opacity-0 transition-opacity duration-500"
            sizes="(max-width: 720px) 50vw, 25vw"
          />
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-contain p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 720px) 50vw, 25vw"
            />
          )}
          {product.compare_at_price && (
            <span
              className="absolute top-3 left-3 bg-gold text-gold-dark text-[11px] font-bold px-2.5 py-0.5"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              {salePercent}% OFF
            </span>
          )}
          <WishlistButton productId={product.id} iconOnly />
        </div>
      </Link>

      <div className="product-card-body px-1 pt-3 pb-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm text-ink leading-snug hover:text-terracotta transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-semibold text-ink text-sm">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && (
            <span className="text-muted text-xs line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

        <p className="text-muted text-[11px] mt-1">EMI options available</p>

        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} />
          <span className="text-muted text-xs">({product.review_count})</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-muted">
            <span className="text-green-600 font-medium">● Ready to order</span> SKU: {product.sku || product.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block text-center text-terracotta text-xs font-semibold mt-2 hover:underline"
        >
          See in your room
        </Link>

        <div className="mt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
