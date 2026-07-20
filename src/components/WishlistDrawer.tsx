"use client";

import { HeartIcon, XIcon, BagIcon, TrashIcon } from "./icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function WishlistDrawer() {
  const [open, setOpen] = useState(false);
  const { items, loading, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!open || items.length === 0) {
      setProducts([]);
      return;
    }
    if (user) {
      fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("gmart_token")}` },
      })
        .then((r) => r.json())
        .then((data) => setProducts(data.products || []))
        .catch(() => setProducts([]));
    } else {
      const all: Product[] = [];
      const stored = JSON.parse(localStorage.getItem("gmart_wishlist") || "[]");
      Promise.all(
        stored.map((id: string) =>
          fetch(`/api/products/search?q=${id}`)
            .then((r) => r.json())
            .then((data) => {
              if (Array.isArray(data)) {
                const found = data.find((p: Product) => p.id === id);
                if (found) all.push(found);
              }
            })
        )
      ).then(() => setProducts(all));
    }
  }, [open, items, user]);

  function addAllToCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    for (const product of products) {
      const idx = cart.findIndex((item: any) => item.productId === product.id);
      if (idx >= 0) {
        cart[idx].quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: 1,
        });
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative text-muted hover:text-terracotta transition-colors"
        aria-label="Open wishlist"
      >
        <HeartIcon size={20} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2 className="font-bold text-ink">Wishlist</h2>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted">Loading...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <HeartIcon size={48} className="text-line mb-4" />
                <p className="text-muted">Your wishlist is empty</p>
                <Link href="/products" onClick={() => setOpen(false)} className="btn-primary mt-6">
                  Explore Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex gap-4 items-center">
                      <Link href={`/products/${product.slug}`} onClick={() => setOpen(false)} className="relative w-20 h-20 bg-[#efefef] flex-shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="80px" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${product.slug}`} onClick={() => setOpen(false)} className="text-sm font-medium text-ink truncate block hover:text-terracotta transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-terracotta text-sm mt-1">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove from wishlist"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {products.length > 0 && (
                  <div className="border-t border-line px-6 py-5">
                    <button onClick={addAllToCart} className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2">
                      <BagIcon size={16} />
                      Add All to Cart
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
