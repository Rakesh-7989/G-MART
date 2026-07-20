"use client";

import { useState, useEffect } from "react";

interface Variant {
  id: string;
  name: string;
  color_hex?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  stock_quantity: number;
  image?: string | null;
  is_default: boolean;
  sku?: string | null;
  sort_order?: number;
}

interface ColorSwatchProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onVariantChange: (variantId: string) => void;
  productPrice: number;
  productComparePrice: number | null;
  productSku: string;
  onPriceChange?: (price: number, compareAtPrice: number | null, sku: string) => void;
}

export default function ColorSwatch({
  variants,
  selectedVariantId,
  onVariantChange,
  productPrice,
  productComparePrice,
  productSku,
  onPriceChange,
}: ColorSwatchProps) {
  const [selected, setSelected] = useState<string | null>(selectedVariantId);

  // Sync with external selection
  useEffect(() => {
    if (selectedVariantId) setSelected(selectedVariantId);
  }, [selectedVariantId]);

  // Auto-select default on mount
  useEffect(() => {
    if (!selected && variants.length > 0) {
      const def = variants.find((v) => v.is_default) || variants[0];
      setSelected(def.id);
      onVariantChange(def.id);
    }
  }, [variants, selected]);

  const selectedVariant = variants.find((v) => v.id === selected);

  const handleSelect = (variantId: string) => {
    setSelected(variantId);
    onVariantChange(variantId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="py-4 border-y border-line">
      <p className="text-xs font-medium text-ink mb-2 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20" strokeWidth="0.5" />
        </svg>
        Color
      </p>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => handleSelect(variant.id)}
            disabled={variant.stock_quantity <= 0}
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-200 ${
              selected === variant.id
                ? "border-terracotta shadow-[0_0_0_2px_#cf542f]"
                : "border-line hover:border-terracotta/50"
            } ${variant.stock_quantity <= 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
              backgroundColor: variant.color_hex || "#f3f3f3",
              backgroundImage: variant.color_hex ? `linear-gradient(135deg, ${variant.color_hex}CC, ${variant.color_hex})` : undefined,
            }}
            title={`${variant.name}${variant.stock_quantity <= 0 ? " (Out of stock)" : ""}`}
          >
            {selected === variant.id && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-sm">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {selectedVariant && (
        <div className="mt-3 p-3 bg-[#efefef] rounded-card text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink font-medium">
              {selectedVariant.name}
              {selectedVariant.sku && <span className="text-muted ml-2 text-xs">SKU: {selectedVariant.sku}</span>}
            </span>
            {selectedVariant.stock_quantity <= 0 && (
              <span className="text-red-500 text-xs font-medium">Out of stock</span>
            )}
          </div>
          {(selectedVariant.price !== null && selectedVariant.price !== productPrice) ||
           (selectedVariant.compare_at_price !== null && selectedVariant.compare_at_price !== productComparePrice) ? (
            <p className="text-xs text-muted mt-1">Price will update on selection</p>
          ) : null}
        </div>
      )}
    </div>
  );
}