"use client";

import { useState } from "react";
import { Product, CartItem, ProductVariant } from "@/lib/types";

export default function AddToCartButton({
  product,
  variantId,
  className = "",
  fullWidth = true,
}: {
  product: Product;
  variantId?: string | null;
  className?: string;
  fullWidth?: boolean;
}) {
  const [added, setAdded] = useState(false);

  // Find selected variant
  const variant = variantId ? product.product_variants?.find((v: ProductVariant) => v.id === variantId) : null;
  const effectivePrice = variant?.price ?? product.price;
  const effectiveImage = variant?.image ?? product.images?.[0] ?? "";
  const effectiveName = variant ? `${product.name} - ${variant.name}` : product.name;
  const effectiveSku = variant?.sku || product.sku;
  const effectiveStock = variant?.stock_quantity ?? (product.in_stock ? 999 : 0);

  function handleAddToCart() {
    if (effectiveStock <= 0) return;
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartKey = variant ? `${product.id}-${variant.id}` : product.id;
    const idx = cart.findIndex((item) => (item.variantId ? `${item.productId}-${item.variantId}` : item.productId) === cartKey);
    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
    } else {
      cart.push({
        productId: product.id,
        variantId: variant?.id,
        name: effectiveName,
        price: effectivePrice,
        image: effectiveImage,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={effectiveStock <= 0}
      className={`${fullWidth ? "w-full" : ""} ${
        added
          ? "bg-green-600 text-white"
          : effectiveStock <= 0
          ? "bg-line text-muted cursor-not-allowed"
          : "bg-terracotta text-white hover:bg-terracotta-dark"
      } font-semibold text-xs px-6 py-2.5 transition-colors duration-300 ${className}`}
      style={{ borderRadius: "var(--radius-button)" }}
    >
      {added ? "Added!" : effectiveStock <= 0 ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
