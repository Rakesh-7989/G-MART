"use client";

import { BagIcon, XIcon, MinusIcon, PlusIcon, TrashIcon, ShieldIcon } from "./icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function updateCart() {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      setItems(cart);
    }
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
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

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative text-muted hover:text-terracotta transition-colors"
        aria-label="Open cart"
      >
        <BagIcon size={20} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-ink text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2 className="font-bold text-ink">Shopping Cart</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink transition-colors" aria-label="Close cart">
                <XIcon size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <BagIcon size={48} className="text-line mb-4" />
                <p className="text-muted">Your cart is empty</p>
                <Link href="/products" onClick={() => setOpen(false)} className="btn-primary mt-6">
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-[#efefef] flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                        <p className="text-terracotta text-sm mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-line">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 py-0.5 hover:bg-[#efefef]">
                              <MinusIcon size={12} />
                            </button>
                            <span className="px-3 py-0.5 text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 py-0.5 hover:bg-[#efefef]">
                              <PlusIcon size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-red-500 transition-colors">
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-ink">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line px-6 py-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="btn-outline w-full text-center block text-sm py-3"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center block text-sm py-3"
                  >
                    Checkout — {formatPrice(subtotal)}
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                    <ShieldIcon size={14} />
                    Secure checkout
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
