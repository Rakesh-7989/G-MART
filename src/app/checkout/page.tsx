"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { placeOrder } from "@/lib/api";
import CashfreeCheckout from "@/components/CashfreeCheckout";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  function updateCart() {
    const stored: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);

    const result = await placeOrder({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      total: subtotal,
      shippingAddress: {
        line1: form.line1, line2: form.line2,
        city: form.city, state: form.state, pincode: form.pincode,
      },
      customer: { name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone },
      paymentMethod,
    });

    setPlacing(false);

    if (!result.success) {
      alert("Failed to place order. Please try again.");
      return;
    }

    const createdOrderId = result.order?.id;
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));

    if (paymentMethod === "cod") {
      router.push(`/order/${createdOrderId}`);
    } else {
      setOrderId(createdOrderId);
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
          <form className="space-y-4" onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            </div>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Address Line 1" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Address Line 2" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" />
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
              <input type="text" placeholder="Pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            </div>

            <h2 className="font-serif text-xl text-luxury-brown mt-8 mb-4">Payment Method</h2>
            <label className="flex items-center gap-3 p-4 border border-luxury-gold/20 bg-white cursor-pointer">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-luxury-gold" />
              <div>
                <p className="font-medium text-luxury-brown">Cash on Delivery</p>
                <p className="text-sm text-luxury-brown/60">Pay when your order arrives</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-luxury-gold/20 bg-white cursor-pointer">
              <input type="radio" name="payment" value="cashfree" checked={paymentMethod === "cashfree"} onChange={() => setPaymentMethod("cashfree")} className="accent-luxury-gold" />
              <div>
                <p className="font-medium text-luxury-brown">Pay Online</p>
                <p className="text-sm text-luxury-brown/60">Credit/Debit Card, UPI, Net Banking (via Cashfree)</p>
              </div>
            </label>

            {orderId && paymentMethod === "cashfree" ? (
              <CashfreeCheckout
                orderId={orderId}
                amount={subtotal}
                customer={{
                  name: `${form.firstName} ${form.lastName}`,
                  email: form.email,
                  phone: form.phone,
                }}
                onSuccess={() => router.push(`/order/${orderId}`)}
                onError={() => alert("Payment failed. Please try again.")}
              />
            ) : (
              <button type="submit" disabled={placing} className="btn-primary w-full mt-8 disabled:opacity-50">
                {placing ? "Placing Order..." : `Place Order — ${formatPrice(subtotal)}`}
              </button>
            )}
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
