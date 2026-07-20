"use client";

import { useState, useEffect } from "react";

export default function CategoryManager({ token }: { token: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCategories(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  function resetForm() {
    setForm({ name: "", slug: "", description: "", image_url: "" });
    setEditing(null);
    setError("");
  }

  function editCategory(cat: any) {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image_url: cat.image_url || "" });
    setEditing(cat);
    setShowForm(true);
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const url = "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        resetForm();
        fetchCategories();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save category");
    }
  }

  async function deleteCategory(id: string) {
    try {
      await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch { /* ignore */ }
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-12 bg-[#efefef]" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-ink text-xl">Categories</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveCategory} className="bg-[#efefef] p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-ink">{editing ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" required />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border border-line px-3 py-2 text-sm text-ink" required />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-line px-3 py-2 text-sm text-ink" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full border border-line px-3 py-2 text-sm text-ink" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-sm">{editing ? "Update" : "Create"} Category</button>
            <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-outline text-sm">Cancel</button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <p className="text-muted text-sm">No categories found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted uppercase tracking-wider text-xs">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Products</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-[#efefef]">
                <td className="px-4 py-3 text-ink font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-muted">{cat.product_count || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => editCategory(cat)} className="text-xs text-terracotta hover:underline">Edit</button>
                    <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
