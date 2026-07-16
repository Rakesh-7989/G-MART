"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);

    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(updated);
    };
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  function updateQuantity(productId: string, delta: number) {
    const newItems = items
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function removeItem(productId: string) {
    const newItems = items.filter((item) => item.productId !== productId);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-luxury-gold/40 mb-6" />
        <h1 className="font-serif text-3xl text-luxury-brown mb-4">Your Cart is Empty</h1>
        <p className="text-luxury-brown/60 mb-8">Add some luxury pieces to your collection.</p>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-luxury-brown mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-6 border-b border-luxury-gold/20 pb-6">
              <div className="relative w-24 h-24 bg-luxury-brown/5 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-luxury-brown">{item.name}</h3>
                <p className="text-luxury-gold font-medium mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-luxury-gold/30">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1 hover:bg-luxury-gold/10">
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1 hover:bg-luxury-gold/10">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-luxury-brown/40 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-luxury-brown">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-luxury-brown/5 p-8 h-fit">
          <h2 className="font-serif text-xl text-luxury-brown mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-luxury-brown/60">Subtotal</span>
              <span className="text-luxury-brown font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-luxury-brown/60">Shipping</span>
              <span className="text-luxury-brown font-medium">Free</span>
            </div>
            <div className="border-t border-luxury-gold/20 pt-3 flex justify-between text-lg">
              <span className="font-serif text-luxury-brown">Total</span>
              <span className="font-serif text-luxury-gold font-bold">{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="btn-primary w-full text-center block mt-8"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
