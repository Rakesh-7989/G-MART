"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { XIcon } from "./icons";

const MATERIALS = ["Wood", "Metal", "Glass", "Fabric", "Marble", "Leather", "Velvet"];
const COLORS = ["Brown", "Black", "White", "Beige", "Gray", "Gold", "Blue", "Green"];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeMaterial = searchParams.get("material") || "";
  const activeColor = searchParams.get("color") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const applyFilter = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      sp.delete("page");
      router.push(`/products?${sp.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("material");
    sp.delete("color");
    sp.delete("minPrice");
    sp.delete("maxPrice");
    sp.delete("page");
    router.push(`/products?${sp.toString()}`);
  }, [router, searchParams]);

  const hasFilters = activeMaterial || activeColor || minPrice || maxPrice;

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs uppercase tracking-wider text-muted mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => applyFilter("minPrice", e.target.value)}
            className="w-full border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta"
          />
          <span className="text-muted">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => applyFilter("maxPrice", e.target.value)}
            className="w-full border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-muted mb-3">Material</h4>
        <div className="space-y-2">
          {MATERIALS.map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer text-sm text-muted hover:text-ink">
              <input
                type="radio"
                name="material"
                checked={activeMaterial === m.toLowerCase()}
                onChange={() => applyFilter("material", activeMaterial === m.toLowerCase() ? "" : m.toLowerCase())}
                className="accent-terracotta"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-muted mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => applyFilter("color", activeColor === c.toLowerCase() ? "" : c.toLowerCase())}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                activeColor === c.toLowerCase()
                  ? "bg-ink text-white border-ink"
                  : "border-line text-ink hover:border-terracotta"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="text-xs text-terracotta hover:underline flex items-center gap-1">
          <XIcon size={12} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-line px-4 py-2 text-sm text-ink hover:bg-[#efefef] transition-colors lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        Filters
        {hasFilters && <span className="bg-ink text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>}
      </button>

      <div className="hidden lg:block w-56 flex-shrink-0">
        {filterContent}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-ink">Filters</h3>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink">
                <XIcon size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
