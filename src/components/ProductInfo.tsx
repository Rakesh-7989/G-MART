"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { StarIcon } from "@/components/icons";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import TrustBadges from "@/components/TrustBadges";
import PincodeChecker from "@/components/PincodeChecker";
import ColorSwatch from "@/components/ColorSwatch";

interface ProductVariant {
  id: string;
  name: string;
  color_hex: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  image: string | null;
  is_default: boolean;
  sku?: string | null;
  sort_order?: number;
}

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const reviewCount = product.review_count || 0;
  const comparePrice = product.compare_at_price;

  // Find default variant
  const defaultVariant = product.product_variants?.find((v: any) => v.is_default) || product.product_variants?.[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id || null);

  return (
    <>
      <p className="text-terracotta uppercase tracking-wider text-sm mb-2 font-medium">
        {product.category?.name || "Furniture"}
      </p>

      <h1 className="text-3xl md:text-4xl text-ink font-bold mb-4">
        {product.name}
      </h1>

      {/* SKU + Badge */}
      <div className="flex items-center gap-3 mb-4">
        {product.compare_at_price && (
          <span className="bg-terracotta/10 text-terracotta text-[11px] font-semibold px-2 py-0.5 uppercase tracking-wider">
            Sale
          </span>
        )}
        {product.sku && (
          <span className="text-xs text-muted">
            SKU: {product.sku}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-ink">
          {formatPrice(product.price)}
        </span>
        {comparePrice && (
          <span className="text-lg text-muted line-through">
            {formatPrice(comparePrice)}
          </span>
        )}
        {comparePrice && (
          <span className="text-sm font-medium text-terracotta">
            {Math.round(((comparePrice - product.price) / comparePrice) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            size={16}
            className={i < Math.round(product.rating) ? "text-ink" : "text-line"}
            fill={i < Math.round(product.rating) ? "currentColor" : "none"}
          />
        ))}
        <span className="text-sm text-muted">
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      </div>

      {/* Description */}
      <p className="text-muted leading-relaxed text-sm mb-6">
        {product.description}
      </p>

      {/* Color Variants */}
      {(product.product_variants && product.product_variants.length > 0) && (
        <ColorSwatch
          variants={product.product_variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={setSelectedVariantId}
          productPrice={product.price}
          productComparePrice={product.compare_at_price ?? null}
          productSku={product.sku || ""}
        />
      )}

      {/* Specs grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm border-t border-line pt-6">
        {product.material && (
          <div>
            <span className="text-muted text-xs uppercase tracking-wider">Material</span>
            <p className="text-ink mt-0.5">{product.material}</p>
          </div>
        )}
        {product.color && (
          <div>
            <span className="text-muted text-xs uppercase tracking-wider">Color</span>
            <p className="text-ink mt-0.5">{product.color}</p>
          </div>
        )}
        {product.dimensions && (
          <div>
            <span className="text-muted text-xs uppercase tracking-wider">Dimensions</span>
            <p className="text-ink mt-0.5">{product.dimensions}</p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Pincode Checker */}
      <PincodeChecker />

      {/* Add to Cart + Wishlist */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <AddToCartButton product={product} variantId={selectedVariantId} />
        </div>
        <WishlistButton productId={product.id} />
      </div>

      {/* WhatsApp Enquire */}
      <a
        href={`https://wa.me/919319574949?text=Hi, I'm interested in ${product.name} (SKU: ${product.sku || "N/A"})`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white w-full justify-center text-sm flex items-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enquire on WhatsApp
      </a>
    </>
  );
}