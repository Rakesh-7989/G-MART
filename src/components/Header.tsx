"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { CartItem } from "@/lib/types";
import AnnouncementBar from "./AnnouncementBar";
import Navigation from "./Navigation";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const WishlistDrawer = dynamic(() => import("./WishlistDrawer"), { ssr: false });
const SearchDialog = dynamic(() => import("./SearchDialog"), { ssr: false });
import {
  MapPinIcon,
  PersonIcon,
  MenuIcon,
  XIcon,
} from "./icons";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateCart() {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    }
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="site-header sticky top-0 z-50 bg-white">
      <AnnouncementBar />

      <div className="border-b border-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <button
              className="lg:hidden flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon size={24} className="text-ink" /> : <MenuIcon size={24} className="text-ink" />}
            </button>

            <Link href="/" className="flex-shrink-0">
              <span className="font-bold text-2xl tracking-tight text-ink">
                G<span className="text-terracotta">-</span>MART
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <SearchDialog />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-1.5 text-muted hover:text-terracotta transition-colors text-xs"
              >
                <MapPinIcon size={18} />
                <span className="hidden lg:inline">Store</span>
              </Link>

              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-muted hover:text-terracotta transition-colors text-xs"
              >
                <PersonIcon size={18} />
                <span className="hidden lg:inline">Account</span>
              </Link>

              <WishlistDrawer />

              <CartDrawer />
            </div>
          </div>
        </div>
      </div>

      <Navigation />

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" ref={menuRef}>
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-[85vw] max-w-sm bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <span className="font-bold text-lg text-ink">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <XIcon size={20} className="text-muted" />
              </button>
            </div>

            <div className="bg-terracotta/10 p-4 text-center">
              <p className="font-semibold text-ink text-sm">Free express shipping</p>
              <p className="text-muted text-xs mt-0.5">
                Fresh arrivals, store support, and secure checkout in one place.
              </p>
            </div>

            <div className="p-4 border-b border-line">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <PersonIcon size={20} className="text-muted" />
                <div>
                  <p className="font-semibold text-ink text-sm">Log in / create account</p>
                  <p className="text-muted text-xs">Save wishlist items and check orders faster</p>
                </div>
              </Link>
            </div>

            <nav className="p-4">
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-ink font-medium border-b border-line"
              >
                All Products
              </Link>
              {[
                "Living Room",
                "Bedroom",
                "Dining",
                "Storage",
                "Office & Study",
                "Decor",
              ].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-ink border-b border-line hover:text-terracotta transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
