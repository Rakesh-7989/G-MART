"use client";

import { SearchIcon, XIcon } from "./icons";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      <form
        role="search"
        action="/search"
        method="get"
        className="relative w-full hidden md:block"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }
        }}
      >
        <input type="hidden" name="type" value="product" />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="What are you looking for?"
          aria-label="Search"
          className="w-full border border-line bg-white text-ink placeholder:text-muted/50 px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
          ref={inputRef}
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-terracotta transition-colors"
        >
          <SearchIcon size={18} />
        </button>

        {open && query && (
          <div className="absolute top-full left-0 right-0 bg-white border border-line shadow-theme z-50 mt-1 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center text-muted py-6 text-sm">Searching...</p>
            ) : results.length === 0 ? (
              <p className="text-center text-muted py-6 text-sm">
                No products found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="divide-y divide-line">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={close}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#efefef] transition-colors"
                  >
                    <div className="relative w-12 h-12 bg-card-bg flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted">{product.category?.name || ""}</p>
                    </div>
                    <div className="text-sm text-ink font-semibold whitespace-nowrap">
                      {formatPrice(product.price)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      <button
        className="md:hidden text-muted hover:text-terracotta transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <SearchIcon size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={close} />
          <div className="relative bg-white w-full max-w-lg mx-auto mt-20 shadow-2xl border border-line max-h-[70vh] flex flex-col">
            <div className="flex items-center border-b border-line px-4">
              <SearchIcon size={18} className="text-muted flex-shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 p-4 text-ink placeholder:text-muted/40 focus:outline-none bg-transparent text-sm"
                autoFocus
              />
              <button onClick={close} className="text-muted hover:text-ink">
                <XIcon size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && <p className="text-center text-muted py-8 text-sm">Searching...</p>}
              {!loading && query && results.length === 0 && (
                <p className="text-center text-muted py-8 text-sm">No products found for &ldquo;{query}&rdquo;</p>
              )}
              {!loading && results.length > 0 && (
                <div className="divide-y divide-line">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={close}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#efefef] transition-colors"
                    >
                      <div className="relative w-14 h-14 bg-card-bg flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink truncate font-medium">{product.name}</p>
                        <p className="text-xs text-muted">{product.category?.name || ""}</p>
                      </div>
                      <div className="text-sm text-ink font-semibold whitespace-nowrap">
                        {formatPrice(product.price)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
