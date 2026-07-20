"use client";

import { HeartIcon } from "./icons";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistButton({
  productId,
  className = "",
  iconOnly = false,
}: {
  productId: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(productId);

  if (iconOnly) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(productId);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all ${
          active ? "text-red-500 scale-110" : "text-ink/40 hover:text-red-400"
        } ${className}`}
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon size={18} fill={active} />
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`flex items-center gap-2 px-6 py-3 border text-sm uppercase tracking-wider transition-colors ${
        active
          ? "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
          : "border-line text-ink hover:bg-[#efefef]"
      } ${className}`}
    >
      <HeartIcon size={16} fill={active} />
      {active ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  );
}
