"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BagIcon, MinusIcon, PlusIcon, TrashIcon, TruckIcon, ShieldIcon, CreditCardIcon } from "@/components/icons";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);

    function handler() {
      const updated = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(updated);
    }
    window.addEventListener("cartUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cartUpdated", handler);
      window.removeEventListener("storage", handler);
    };
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
        <BagIcon size={64} className="mx-auto text-line mb-6" />
        <h1 className="text-3xl text-ink font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted mb-8">Add some pieces to your collection.</p>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl text-ink font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-6 border-b border-line pb-6">
              <div className="relative w-24 h-24 bg-[#efefef] flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ink">{item.name}</h3>
                <p className="text-terracotta font-medium mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-line">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1 hover:bg-[#efefef]">
                      <MinusIcon size={14} />
                    </button>
                    <span className="px-4 py-1 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1 hover:bg-[#efefef]">
                      <PlusIcon size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-500 transition-colors">
                    <TrashIcon size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-ink">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-[#efefef] p-8">
            <h2 className="font-bold text-ink text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-ink font-medium">Free</span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between text-lg">
                <span className="font-bold text-ink">Total</span>
                <span className="font-bold text-ink">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn-primary w-full text-center block mt-8"
            >
              Proceed to Checkout
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-4 mt-6 text-sm text-muted">
            <div className="flex items-center gap-3">
              <TruckIcon size={20} className="text-terracotta" />
              <span>Free delivery on all orders</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldIcon size={20} className="text-terracotta" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCardIcon size={20} className="text-terracotta" />
              <span>Easy EMI & No-cost financing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
