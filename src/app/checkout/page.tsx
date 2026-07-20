"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { placeOrder } from "@/lib/api";
import CashfreeCheckout from "@/components/CashfreeCheckout";
import { ShieldIcon, TruckIcon, CreditCardIcon } from "@/components/icons";

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

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string; type: string; value: number; discount: number; description: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

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
  const discount = appliedCoupon?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
      } else {
        setCouponError(data.error || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
    setCouponLoading(false);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

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
      total,
      shippingAddress: {
        line1: form.line1, line2: form.line2,
        city: form.city, state: form.state, pincode: form.pincode,
      },
      customer: { name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone },
      paymentMethod,
      couponCode: appliedCoupon?.code || undefined,
      discount: discount || undefined,
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
        <h1 className="text-3xl text-ink font-bold mb-4">Your cart is empty</h1>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Secure Checkout</p>
        <h1 className="text-3xl text-ink font-bold">Complete Your Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="font-bold text-ink text-xl mb-6">Shipping Details</h2>
          <form className="space-y-4" onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
            </div>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
            <input type="text" placeholder="Address Line 1" value={form.line1} onChange={(e) => updateField("line1", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
            <input type="text" placeholder="Address Line 2" value={form.line2} onChange={(e) => updateField("line2", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
              <input type="text" placeholder="State" value={form.state} onChange={(e) => updateField("state", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
              <input type="text" placeholder="Pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
            </div>

            <h2 className="font-bold text-ink text-xl mt-8 mb-4">Payment Method</h2>
            <label className="flex items-center gap-3 p-4 border border-line bg-white cursor-pointer">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-terracotta" />
              <div>
                <p className="font-medium text-ink">Cash on Delivery</p>
                <p className="text-sm text-muted">Pay when your order arrives</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-line bg-white cursor-pointer">
              <input type="radio" name="payment" value="cashfree" checked={paymentMethod === "cashfree"} onChange={() => setPaymentMethod("cashfree")} className="accent-terracotta" />
              <div>
                <p className="font-medium text-ink">Pay Online</p>
                <p className="text-sm text-muted">Credit/Debit Card, UPI, Net Banking (via Cashfree)</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border border-line bg-white cursor-pointer">
              <input type="radio" name="payment" value="emi" checked={paymentMethod === "emi"} onChange={() => setPaymentMethod("emi")} className="accent-terracotta" />
              <div>
                <p className="font-medium text-ink">EMI (Credit Card)</p>
                <p className="text-sm text-muted">Pay in easy monthly installments</p>
              </div>
            </label>

            {orderId && (paymentMethod === "cashfree" || paymentMethod === "emi") ? (
              <CashfreeCheckout
                orderId={orderId}
                amount={total}
                customer={{
                  name: `${form.firstName} ${form.lastName}`,
                  email: form.email,
                  phone: form.phone,
                }}
                paymentMethod={paymentMethod}
                onSuccess={() => router.push(`/order/${orderId}`)}
                onError={() => alert("Payment failed. Please try again.")}
              />
            ) : (
              <button type="submit" disabled={placing} className="btn-primary w-full mt-8 disabled:opacity-50">
                {placing ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
              </button>
            )}
          </form>
        </div>

        <div>
          <div className="bg-[#efefef] p-8">
            <h2 className="font-bold text-ink text-xl mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted">
                    {item.name} <span className="text-muted">×{item.quantity}</span>
                  </span>
                  <span className="text-ink font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="border-t border-line mt-6 pt-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 p-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.description || `${appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value.toLocaleString("en-IN")} off`}`}
                    </p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-line px-3 py-2 text-sm text-ink"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="border border-line px-4 py-2 text-sm text-ink hover:bg-[#efefef] disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mb-4">{couponError}</p>}
            </div>

            <div className="border-t border-line pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-ink">Free</span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between text-lg">
                <span className="font-bold text-ink">Total</span>
                <span className="font-bold text-ink">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 text-sm text-muted">
            <div className="flex items-center gap-3">
              <TruckIcon size={18} className="text-terracotta" />
              <span>Free delivery on all orders</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldIcon size={18} className="text-terracotta" />
              <span>Secure checkout with SSL encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCardIcon size={18} className="text-terracotta" />
              <span>Easy EMI options available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
