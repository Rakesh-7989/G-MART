"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ShoppingBagIcon, DollarSignIcon, PackageIcon, UsersIcon, PlusIcon } from "@/components/icons";
import RevenueChart from "@/components/admin/RevenueChart";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import OrderManager from "@/components/admin/OrderManager";
import ProductManager from "@/components/admin/ProductManager";
import CustomerList from "@/components/admin/CustomerList";
import ReviewManager from "@/components/admin/ReviewManager";
import CategoryManager from "@/components/admin/CategoryManager";
import CouponManager from "@/components/admin/CouponManager";
import ReturnManager from "@/components/admin/ReturnManager";

type AdminTab = "dashboard" | "products" | "orders" | "customers" | "reviews" | "categories" | "coupons" | "returns";

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [token, setToken] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("gmart_token");
    if (!t) { setCheckingAdmin(false); return; }
    setToken(t);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { setCheckingAdmin(false); return; }
        fetch("/api/admin/check", { headers: { Authorization: `Bearer ${t}` } })
          .then((r) => r.json())
          .then((d) => { setIsAdmin(d.admin); setCheckingAdmin(false); })
          .catch(() => setCheckingAdmin(false));
      })
      .catch(() => setCheckingAdmin(false));
  }, []);

  useEffect(() => {
    if (!isAdmin || !token) return;
    if (tab === "dashboard") fetchStats();
    if (tab === "products") fetchProducts();
    if (tab === "orders") fetchOrders();
  }, [tab, isAdmin, token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchStats() {
    if (!token) return;
    setLoading(true);
    try {
      const [p, o] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      ]);
      setProducts(Array.isArray(p) ? p : Array.isArray(p?.products) ? p.products : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchProducts() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchOrders() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBagIcon },
    { label: "Revenue", value: `₹${(orders.reduce((s, o) => s + (o.total || 0), 0) / 100).toFixed(1)}L`, icon: DollarSignIcon },
    { label: "Products", value: products.length, icon: PackageIcon },
    { label: "Customers", value: new Set(orders.map((o: any) => o.customer_email)).size, icon: UsersIcon },
  ];

  const tabs: { key: AdminTab; label: string; icon?: any }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "reviews", label: "Reviews" },
    { key: "categories", label: "Categories" },
    { key: "coupons", label: "Coupons" },
    { key: "returns", label: "Returns" },
  ];

  return checkingAdmin ? (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-muted">Checking access...</p>
    </div>
  ) : !isAdmin ? (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl text-ink font-bold mb-4">Access Denied</h1>
      <p className="text-muted mb-6">You do not have admin privileges.</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  ) : (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl text-ink font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/products" className="border border-line text-ink px-4 py-2 text-sm uppercase tracking-wider hover:bg-[#efefef] transition-colors">
            View Store
          </Link>
          {tab === "products" && (
            <Link href="/admin/products/new" className="btn-primary text-sm flex items-center gap-2">
              <PlusIcon /> Add Product
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-10 border-b border-line overflow-x-auto">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as AdminTab)}
            className={`px-6 py-3 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
              tab === key
                ? "text-terracotta border-b-2 border-terracotta"
                : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {!loading && tab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-[#efefef] p-6">
                <Icon className="text-terracotta/60 mb-4" size={24} />
                <p className="text-2xl font-bold text-ink">{typeof value === "number" ? value : value}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="font-bold text-ink text-lg mb-4">Revenue Overview</h2>
            {token && <RevenueChart token={token} />}
          </div>

          {token && <AnalyticsPanel token={token} />}

          <div className="border border-line mt-12">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="font-bold text-ink text-xl">Recent Orders</h2>
            </div>
            {orders.length === 0 ? (
              <p className="p-6 text-muted">No orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted uppercase tracking-wider text-xs">
                    <th className="text-left px-6 py-4 font-medium">Order</th>
                    <th className="text-left px-6 py-4 font-medium">Customer</th>
                    <th className="text-left px-6 py-4 font-medium">Total</th>
                    <th className="text-left px-6 py-4 font-medium">Payment</th>
                    <th className="text-left px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-[#efefef]">
                      <td className="px-6 py-4 font-mono text-xs text-ink">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-muted">{order.customer_name}</td>
                      <td className="px-6 py-4 text-ink">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-muted uppercase text-xs">{order.payment_method}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 ${
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

      {!loading && tab === "products" && token && (
        <ProductManager token={token} />
      )}

      {!loading && tab === "orders" && token && (
        <OrderManager token={token} />
      )}

      {tab === "customers" && token && (
        <CustomerList token={token} />
      )}

      {tab === "reviews" && token && (
        <ReviewManager token={token} />
      )}

      {tab === "categories" && token && (
        <CategoryManager token={token} />
      )}

      {tab === "coupons" && token && (
        <CouponManager token={token} />
      )}

      {tab === "returns" && token && (
        <ReturnManager token={token} />
      )}
    </div>
  );
}
