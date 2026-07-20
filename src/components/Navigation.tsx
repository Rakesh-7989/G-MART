"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon } from "./icons";
import { useState } from "react";

const CATEGORIES = [
  {
    name: "Living Room",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=320&h=127&fit=crop",
    description: "Sofas, sectionals, coffee tables & more",
    links: [
      { name: "Sofas", slug: "living-room?type=sofa" },
      { name: "Coffee Tables", slug: "living-room?type=coffee-table" },
      { name: "TV Units", slug: "living-room?type=tv-unit" },
    ],
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=320&h=127&fit=crop",
    description: "Beds, wardrobes, nightstands & more",
    links: [
      { name: "Beds", slug: "bedroom?type=bed" },
      { name: "Wardrobes", slug: "bedroom?type=wardrobe" },
      { name: "Night Stands", slug: "bedroom?type=night-stand" },
    ],
  },
  {
    name: "Dining",
    slug: "dining",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=320&h=127&fit=crop",
    description: "Dining tables, chairs, cabinets",
    links: [
      { name: "Dining Tables", slug: "dining?type=dining-table" },
      { name: "Chairs", slug: "dining?type=chair" },
      { name: "Cabinets", slug: "dining?type=cabinet" },
    ],
  },
  {
    name: "Storage",
    slug: "storage",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&h=127&fit=crop",
    description: "Bookcases, shelving, sideboards",
    links: [
      { name: "Bookcases", slug: "storage?type=bookcase" },
      { name: "Shelving", slug: "storage?type=shelving" },
      { name: "Sideboards", slug: "storage?type=sideboard" },
    ],
  },
  {
    name: "Office & Study",
    slug: "office",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=320&h=127&fit=crop",
    description: "Desks, chairs, office storage",
    links: [
      { name: "Desks", slug: "office?type=desk" },
      { name: "Office Chairs", slug: "office?type=chair" },
      { name: "Office Storage", slug: "office?type=storage" },
    ],
  },
  {
    name: "Decor",
    slug: "decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&h=127&fit=crop",
    description: "Lighting, rugs, wall art & accents",
    links: [
      { name: "Lighting", slug: "decor?type=lighting" },
      { name: "Rugs", slug: "decor?type=rugs" },
      { name: "Wall Art", slug: "decor?type=wall-art" },
    ],
  },
];

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:block bg-white border-b border-line">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-center gap-1">
          <li>
            <Link
              href="/products"
              className="flex items-center gap-1 px-4 py-3 text-sm text-ink hover:text-terracotta transition-colors font-medium"
            >
              All
            </Link>
          </li>
          {CATEGORIES.map((cat) => (
            <li
              key={cat.slug}
              className="relative group"
              onMouseEnter={() => setActiveMenu(cat.slug)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="flex items-center gap-1 px-4 py-3 text-sm text-ink hover:text-terracotta transition-colors font-medium"
              >
                {cat.name}
                <ChevronDownIcon size={14} className="text-muted" />
              </Link>

              {activeMenu === cat.slug && (
                <div className="absolute left-0 top-full bg-white border border-line shadow-theme z-50 w-[500px]">
                  <div className="flex p-6 gap-6">
                    <div className="flex-shrink-0 w-[220px]">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={220}
                        height={140}
                        className="w-full object-cover"
                        style={{ height: "140px" }}
                        loading="lazy"
                      />
                      <p className="font-bold text-ink mt-3 text-sm">{cat.name}</p>
                      <p className="text-muted text-xs mt-1">{cat.description}</p>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="inline-block mt-3 text-terracotta text-sm font-semibold hover:underline"
                      >
                        Shop {cat.name} →
                      </Link>
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">
                        Popular
                      </p>
                      <ul className="space-y-2">
                        {cat.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              href={`/products?category=${link.slug}`}
                              className="text-sm text-muted hover:text-terracotta transition-colors"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
