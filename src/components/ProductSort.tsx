"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "name-asc", label: "Alphabetically A-Z" },
  { value: "name-desc", label: "Alphabetically Z-A" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "newest", label: "Date new to old" },
  { value: "oldest", label: "Date old to new" },
];

export default function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "featured";

  const handleChange = useCallback(
    (value: string) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (value === "featured") {
        sp.delete("sort");
      } else {
        sp.set("sort", value);
      }
      sp.delete("page");
      router.push(`/products?${sp.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta cursor-pointer"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
