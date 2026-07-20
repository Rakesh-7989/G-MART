"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./auth";

interface WishlistContext {
  items: string[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistCtx = createContext<WishlistContext>({
  items: [],
  loading: true,
  isInWishlist: () => false,
  toggleWishlist: async () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFromLocal = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem("gmart_wishlist") || "[]");
    setItems(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("gmart_token")}` },
      })
        .then((r) => r.json())
        .then((data) => {
          const ids = data.ids || [];
          setItems(ids);
          localStorage.setItem("gmart_wishlist", JSON.stringify(ids));
          setLoading(false);
        })
        .catch(() => loadFromLocal());
    } else {
      loadFromLocal();
    }
  }, [user, loadFromLocal]);

  const saveLocal = useCallback((ids: string[]) => {
    localStorage.setItem("gmart_wishlist", JSON.stringify(ids));
    setItems(ids);
    window.dispatchEvent(new Event("wishlistUpdated"));
  }, []);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const inList = items.includes(productId);
      if (inList) {
        if (user) {
          try {
            await fetch(`/api/wishlist/${productId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${localStorage.getItem("gmart_token")}` },
            });
          } catch {}
        }
        saveLocal(items.filter((id) => id !== productId));
      } else {
        if (user) {
          try {
            await fetch("/api/wishlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("gmart_token")}`,
              },
              body: JSON.stringify({ productId }),
            });
          } catch {}
        }
        saveLocal([...items, productId]);
      }
    },
    [items, user, saveLocal]
  );

  return (
    <WishlistCtx.Provider
      value={{ items, loading, isInWishlist: (id) => items.includes(id), toggleWishlist }}
    >
      {children}
    </WishlistCtx.Provider>
  );
}

export const useWishlist = () => useContext(WishlistCtx);
