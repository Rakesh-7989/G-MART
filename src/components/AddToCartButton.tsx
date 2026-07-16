"use client";

import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  function handleAddToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added to cart!");
  }

  return (
    <button onClick={handleAddToCart} className="btn-primary flex items-center gap-3 w-fit">
      <ShoppingBag size={18} />
      Add to Cart
    </button>
  );
}
