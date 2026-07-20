"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", compare_at_price: "",
    images: "", category_id: "", material: "", dimensions: "", color: "",
    in_stock: true, featured: false,
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseInt(form.price),
        compare_at_price: form.compare_at_price ? parseInt(form.compare_at_price) : null,
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      showToast("Failed to create product", "error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl text-ink font-bold mb-8">New Product</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
          <input type="text" placeholder="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm h-24" required />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required />
          <input type="number" placeholder="Compare at Price" value={form.compare_at_price} onChange={(e) => update("compare_at_price", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        </div>
        <input type="text" placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => update("images", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        <div className="grid grid-cols-3 gap-4">
          <select value={form.category_id} onChange={(e) => update("category_id", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Material" value={form.material} onChange={(e) => update("material", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
          <input type="text" placeholder="Dimensions" value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Color" value={form.color} onChange={(e) => update("color", e.target.value)} className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => update("in_stock", e.target.checked)} className="accent-terracotta" /> In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-terracotta" /> Featured
            </label>
          </div>
        </div>
        <button type="submit" className="btn-primary">Create Product</button>
      </form>
    </div>
  );
}
