"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { TrashIcon } from "@/components/icons";

interface ProductManagerProps {
  token: string;
}

export default function ProductManager({ token }: ProductManagerProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function toggleStock(productId: string, currentStatus: boolean) {
    setUpdating(productId);
    try {
      await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ in_stock: !currentStatus }),
      });
      fetchProducts();
    } catch { /* ignore */ }
    setUpdating(null);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  }

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchStock = stockFilter === "all" ||
      (stockFilter === "in" && p.in_stock) ||
      (stockFilter === "out" && !p.in_stock);
    return matchSearch && matchStock;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line px-4 py-2 text-sm text-ink"
        />
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-12 bg-[#efefef]" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">SKU</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 text-ink font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{product.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-muted text-xs font-mono">{product.sku || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStock(product.id, product.in_stock)}
                      disabled={updating === product.id}
                      className={cn(
                        "text-xs px-3 py-1 border transition-colors",
                        product.in_stock
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                      )}
                    >
                      {updating === product.id ? "..." : product.in_stock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-300 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-muted text-sm py-8 text-center">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
