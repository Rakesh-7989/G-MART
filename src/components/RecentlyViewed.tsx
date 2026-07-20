"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const MAX_RECENT = 8;

function getRecent(): { slug: string; name: string; price: number; image: string }[] {
  try {
    return JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  } catch {
    return [];
  }
}

export function trackRecentlyViewed(product: { slug: string; name: string; price: number; images: string[] }) {
  const recent = getRecent().filter((r) => r.slug !== product.slug);
  recent.unshift({
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0] || "",
  });
  localStorage.setItem("recentlyViewed", JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    setProducts(getRecent());
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="text-center mb-10">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">
          Recently Viewed
        </p>
        <h2 className="text-2xl text-ink font-bold">Your Recent Items</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="group"
          >
            <div className="relative aspect-[4/5] bg-[#efefef] overflow-hidden mb-2">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
              )}
            </div>
            <p className="text-xs text-ink truncate font-medium">{p.name}</p>
            <p className="text-xs text-muted">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
