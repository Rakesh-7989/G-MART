"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, DollarSign, Package, Users, Plus, Trash2 } from "lucide-react";

type AdminTab = "dashboard" | "products" | "orders";

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tab === "dashboard") fetchStats();
    if (tab === "products") fetchProducts();
    if (tab === "orders") fetchOrders();
  }, [tab]);

  async function fetchStats() {
    setLoading(true);
    const [p, o] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]);
    setProducts(p || []);
    setOrders(o || []);
    setLoading(false);
  }

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    setProducts(await res.json());
    setLoading(false);
  }

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    setOrders(await res.json());
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  async function updateOrderStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, change: "" },
    { label: "Revenue", value: `₹${(orders.reduce((s, o) => s + (o.total || 0), 0) / 100).toFixed(1)}L`, icon: DollarSign, change: "" },
    { label: "Products", value: products.length, icon: Package, change: "" },
    { label: "Customers", value: new Set(orders.map((o) => o.customer_email)).size, icon: Users, change: "" },
  ];

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl text-luxury-brown">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/products" className="border border-luxury-gold/30 text-luxury-brown px-4 py-2 text-sm uppercase tracking-wider hover:bg-luxury-gold/10 transition-colors">
            View Store
          </Link>
          {tab === "products" && (
            <Link
              href="/admin/products/new"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Add Product
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-10 border-b border-luxury-gold/20">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
              tab === key
                ? "text-luxury-gold border-b-2 border-luxury-gold"
                : "text-luxury-brown/60 hover:text-luxury-brown"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-luxury-brown/60 text-center py-10">Loading...</p>}

      {!loading && tab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-luxury-gold/20 p-6">
                <Icon className="text-luxury-gold/60 mb-4" size={24} />
                <p className="text-2xl font-serif text-luxury-brown">{value}</p>
                <p className="text-sm text-luxury-brown/60 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-luxury-gold/20">
            <div className="px-6 py-4 border-b border-luxury-gold/20">
              <h2 className="font-serif text-xl text-luxury-brown">Recent Orders</h2>
            </div>
            {orders.length === 0 ? (
              <p className="p-6 text-luxury-brown/60">No orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-luxury-brown/60 uppercase tracking-wider text-xs">
                    <th className="text-left px-6 py-4 font-medium">Order</th>
                    <th className="text-left px-6 py-4 font-medium">Customer</th>
                    <th className="text-left px-6 py-4 font-medium">Total</th>
                    <th className="text-left px-6 py-4 font-medium">Payment</th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b hover:bg-luxury-gold/5">
                      <td className="px-6 py-4 font-mono text-xs text-luxury-brown">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-luxury-brown/70">{order.customer_name}</td>
                      <td className="px-6 py-4 text-luxury-brown">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-luxury-brown/70 uppercase text-xs">{order.payment_method}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "shipped" ? "bg-yellow-100 text-yellow-700" :
                          order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {!loading && tab === "products" && (
        <div className="bg-white border border-luxury-gold/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-luxury-brown/60 uppercase tracking-wider text-xs">
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Category</th>
                <th className="text-left px-6 py-4 font-medium">Price</th>
                <th className="text-left px-6 py-4 font-medium">Stock</th>
                <th className="text-left px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-luxury-gold/5">
                  <td className="px-6 py-4 text-luxury-brown">{product.name}</td>
                  <td className="px-6 py-4 text-luxury-brown/70">{product.category?.name || ""}</td>
                  <td className="px-6 py-4 text-luxury-brown">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.in_stock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "orders" && (
        <div className="bg-white border border-luxury-gold/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-luxury-brown/60 uppercase tracking-wider text-xs">
                <th className="text-left px-6 py-4 font-medium">Order ID</th>
                <th className="text-left px-6 py-4 font-medium">Customer</th>
                <th className="text-left px-6 py-4 font-medium">Items</th>
                <th className="text-left px-6 py-4 font-medium">Total</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-luxury-gold/5">
                  <td className="px-6 py-4 font-mono text-xs text-luxury-brown">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-luxury-brown/70">{order.customer_name}<br /><span className="text-xs">{order.customer_email}</span></td>
                  <td className="px-6 py-4 text-luxury-brown/70">{order.order_items?.length || 0}</td>
                  <td className="px-6 py-4 text-luxury-brown">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-yellow-100 text-yellow-700" :
                      order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-luxury-gold/30 p-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
