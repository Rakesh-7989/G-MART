"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Product, CartItem } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((item) => item.productId === product.id);
    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center gap-3 w-fit px-8 py-3 font-medium tracking-wider uppercase text-sm transition-colors duration-300 ${
        added
          ? "bg-green-600 text-white"
          : "bg-luxury-gold text-white hover:bg-luxury-brown"
      }`}
    >
      <ShoppingBag size={18} />
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
