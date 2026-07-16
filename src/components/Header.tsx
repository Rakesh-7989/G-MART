"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { categories } from "@/lib/data";
import { CartItem } from "@/lib/types";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCart() {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    }
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-luxury-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="font-serif text-3xl md:text-4xl text-luxury-brown tracking-wider">
            G<span className="text-luxury-gold">-</span>MART
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
                className="text-sm uppercase tracking-widest text-luxury-brown/80 hover:text-luxury-gold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button className="hidden md:block text-luxury-brown/80 hover:text-luxury-gold transition-colors">
              <Search size={20} />
            </button>
            <Link href="/auth/login" className="text-luxury-brown/80 hover:text-luxury-gold transition-colors">
              <User size={20} />
            </Link>
            <Link href="/cart" className="relative text-luxury-brown/80 hover:text-luxury-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-luxury-gold/20 bg-white">
          <nav className="flex flex-col p-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
                className="text-sm uppercase tracking-widest text-luxury-brown/80 hover:text-luxury-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
