import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-brown/5 mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {product.compare_at_price && (
          <span className="absolute top-4 left-4 bg-luxury-gold text-white text-xs px-3 py-1 uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg text-luxury-brown group-hover:text-luxury-gold transition-colors">
        {product.name}
      </h3>
      <p className="text-luxury-brown/60 text-sm mt-1">{product.category?.name || ""}</p>
      <div className="flex items-center gap-3 mt-2">
        <span className="font-medium text-luxury-brown">
          {formatPrice(product.price)}
        </span>
        {product.compare_at_price && (
          <span className="text-luxury-brown/40 line-through text-sm">
            {formatPrice(product.compare_at_price)}
          </span>
        )}
      </div>
    </Link>
  );
}
