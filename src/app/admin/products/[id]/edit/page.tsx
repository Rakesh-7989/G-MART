"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", compare_at_price: "",
    images: "", category_id: "", material: "", dimensions: "", color: "",
    sku: "", stock_quantity: "0", in_stock: true, featured: false,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("gmart_token")}` },
      }).then((r) => r.json()),
    ]).then(([cats, product]) => {
      setCategories(cats);
      if (product) {
        setForm({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          compare_at_price: product.compare_at_price?.toString() || "",
          images: (product.images || []).join(", "),
          category_id: product.category_id || "",
          material: product.material || "",
          dimensions: product.dimensions || "",
          color: product.color || "",
          sku: product.sku || "",
          stock_quantity: product.stock_quantity?.toString() || "0",
          in_stock: product.in_stock ?? true,
          featured: product.featured ?? false,
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("gmart_token");
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseInt(form.price),
        compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price) : null,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
        category_id: form.category_id,
        material: form.material || null,
        dimensions: form.dimensions || null,
        color: form.color || null,
        sku: form.sku || null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        in_stock: form.in_stock,
        featured: form.featured,
      }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update product");
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12"><p className="text-muted">Loading...</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-muted hover:text-ink text-sm">&larr; Back</Link>
        <h1 className="text-3xl text-ink font-bold">Edit Product</h1>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
          <input type="text" placeholder="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm h-24" required />
        <div className="grid grid-cols-3 gap-4">
          <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
          <input type="number" placeholder="Compare at Price" value={form.compare_at_price} onChange={(e) => update("compare_at_price", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
          <input type="number" placeholder="Stock Quantity" value={form.stock_quantity} onChange={(e) => update("stock_quantity", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        </div>
        <input type="text" placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => update("images", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        <div className="grid grid-cols-3 gap-4">
          <select value={form.category_id} onChange={(e) => update("category_id", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required>
            <option value="">Select Category</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Material" value={form.material} onChange={(e) => update("material", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
          <input type="text" placeholder="Dimensions" value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Color" value={form.color} onChange={(e) => update("color", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
            <input type="text" placeholder="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => update("in_stock", e.target.checked)} className="accent-terracotta" /> In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-terracotta" /> Featured
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save Changes</button>
          <Link href="/admin" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
