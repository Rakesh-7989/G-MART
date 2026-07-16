"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-luxury-brown mb-4">Your cart is empty</h1>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-luxury-brown mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-serif text-xl text-luxury-brown mb-6">Shipping Details</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="Last Name" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            </div>
            <input type="email" placeholder="Email" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="tel" placeholder="Phone" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Address Line 1" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Address Line 2" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" />
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="City" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="State" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="Pincode" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            </div>

            <h2 className="font-serif text-xl text-luxury-brown mt-8 mb-4">Payment Method</h2>
            <label className="flex items-center gap-3 p-4 border border-luxury-gold/20 bg-white cursor-pointer">
              <input type="radio" name="payment" defaultChecked className="accent-luxury-gold" />
              <div>
                <p className="font-medium text-luxury-brown">Cash on Delivery</p>
                <p className="text-sm text-luxury-brown/60">Pay when your order arrives</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-luxury-gold/20 bg-white cursor-pointer mt-3">
              <input type="radio" name="payment" className="accent-luxury-gold" />
              <div>
                <p className="font-medium text-luxury-brown">Pay Online (Cashfree)</p>
                <p className="text-sm text-luxury-brown/60">Credit/Debit Card, UPI, Net Banking</p>
              </div>
            </label>

            <button type="submit" className="btn-primary w-full mt-8">
              Place Order — {formatPrice(subtotal)}
            </button>
          </form>
        </div>

        <div className="bg-luxury-brown/5 p-8 h-fit">
          <h2 className="font-serif text-xl text-luxury-brown mb-6">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-luxury-brown/70">
                  {item.name} <span className="text-luxury-brown/40">×{item.quantity}</span>
                </span>
                <span className="text-luxury-brown">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-luxury-gold/20 mt-6 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-luxury-brown/60">Subtotal</span>
              <span className="text-luxury-brown">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-luxury-brown/60">Shipping</span>
              <span className="text-luxury-brown">Free</span>
            </div>
            <div className="border-t border-luxury-gold/20 pt-3 flex justify-between text-lg">
              <span className="font-serif text-luxury-brown">Total</span>
              <span className="font-serif text-luxury-gold font-bold">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
