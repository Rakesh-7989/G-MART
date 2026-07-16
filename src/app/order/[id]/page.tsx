"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">✓</div>
      <h1 className="font-serif text-3xl text-luxury-brown mb-4">
        Order Placed Successfully!
      </h1>
      <p className="text-luxury-brown/60 mb-4">
        Your order <span className="font-mono text-luxury-gold font-medium">{id}</span> has been confirmed.
      </p>
      <p className="text-luxury-brown/60 mb-8">
        Thank you for shopping at G-MART. You will receive an email confirmation shortly.
      </p>
      <Link href="/products" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
