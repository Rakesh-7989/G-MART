"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { PersonIcon, BagIcon, MapPinIcon, HeartIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import ReturnRequestButton from "@/components/ReturnRequestButton";
import CancelOrderButton from "@/components/CancelOrderButton";

type Tab = "profile" | "orders" | "wishlist" | "addresses";

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
  }, []);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home", line1: "", line2: "", city: "", state: "", pincode: "", is_default: false,
  });

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", email: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (tab === "orders") fetchOrders();
    if (tab === "wishlist") fetchWishlist();
    if (tab === "addresses") fetchAddresses();
  }, [tab]);

  async function fetchOrders() {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch("/api/orders", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setOrders(await res.json());
      else setOrders([]);
    } catch {
      setOrders([]);
    }
    setLoadingData(false);
  }

  async function fetchWishlist() {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("gmart_token");
      if (token) {
        const res = await fetch("/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWishlistProducts(data.products || []);
      } else {
        setWishlistProducts([]);
      }
    } catch {
      setWishlistProducts([]);
    }
    setLoadingData(false);
  }

  async function fetchAddresses() {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("gmart_token");
      if (token) {
        const res = await fetch("/api/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch { /* ignore */ }
    setLoadingData(false);
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("gmart_token");
    if (!token) return;

    const url = editingAddress ? "/api/addresses" : "/api/addresses";
    const method = editingAddress ? "PUT" : "POST";
    const body = editingAddress ? { ...addressForm, id: editingAddress.id } : addressForm;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
      fetchAddresses();
    }
  }

  function resetAddressForm() {
    setAddressForm({ label: "Home", line1: "", line2: "", city: "", state: "", pincode: "", is_default: false });
  }

  function editAddress(addr: any) {
    setEditingAddress(addr);
    setAddressForm({
      label: addr.label, line1: addr.line1, line2: addr.line2 || "", city: addr.city,
      state: addr.state, pincode: addr.pincode, is_default: addr.is_default,
    });
    setShowAddressForm(true);
  }

  async function deleteAddress(id: string) {
    const token = localStorage.getItem("gmart_token");
    if (!token) return;
    await fetch(`/api/addresses?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAddresses();
  }

  function startEditingProfile() {
    setProfileForm({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "" });
    setEditingProfile(true);
    setProfileError("");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
      });
      if (res.ok) {
        setEditingProfile(false);
        window.location.reload();
      } else {
        const data = await res.json();
        setProfileError(data.error || "Failed to update profile");
      }
    } catch {
      setProfileError("Failed to update profile");
    }
    setProfileSaving(false);
  }

  const tabs = [
    { key: "profile" as Tab, label: "Profile", icon: PersonIcon },
    { key: "orders" as Tab, label: "Orders", icon: BagIcon },
    { key: "wishlist" as Tab, label: "Wishlist", icon: HeartIcon },
    { key: "addresses" as Tab, label: "Addresses", icon: MapPinIcon },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl text-ink font-bold mb-4">Please Sign In</h1>
        <Link href="/auth/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl text-ink font-bold mb-10">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="flex flex-row md:flex-col gap-2 md:space-y-1 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap text-left w-full ${
                tab === key
                  ? "bg-terracotta/10 text-terracotta border-l-2 border-terracotta font-medium"
                  : "text-muted hover:text-ink hover:bg-[#efefef]"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap text-left w-full text-muted hover:text-red-500 hover:bg-red-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </nav>

        <div className="md:col-span-3">
          {tab === "profile" && (
            <div className="bg-[#efefef] p-8">
              <h2 className="font-bold text-ink text-xl mb-6">Profile Details</h2>
              {editingProfile ? (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted block mb-1">Name</label>
                      <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Phone</label>
                      <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Email</label>
                    <input value={profileForm.email} disabled className="w-full border border-line px-3 py-2 text-sm text-muted bg-white" />
                  </div>
                  {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={profileSaving} className="btn-primary text-sm">
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => setEditingProfile(false)} className="btn-outline text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-1">Name</p>
                      <p className="text-ink">{user.name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-1">Email</p>
                      <p className="text-ink">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted mb-1">Phone</p>
                      <p className="text-ink">{user.phone || "Not set"}</p>
                    </div>
                  </div>
                  <button onClick={startEditingProfile} className="btn-outline text-sm mt-6">Edit Profile</button>
                </>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="bg-[#efefef] p-8">
              <h2 className="font-bold text-ink text-xl mb-6">Order History</h2>
              {loadingData ? (
                <p className="text-muted text-sm">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <BagIcon size={40} className="text-line mx-auto mb-3" />
                  <p className="text-muted text-sm mb-4">No orders yet.</p>
                  <Link href="/products" className="btn-primary text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted font-mono">#{order.id.slice(0, 8)}</p>
                          <p className="text-ink font-medium mt-1">{formatPrice(order.total)}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {new Date(order.created_at).toLocaleDateString("en-IN")} — {order.order_items?.length || 0} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <a href={`/api/invoice/${order.id}`} className="text-xs text-terracotta hover:underline" target="_blank" rel="noopener noreferrer">Invoice</a>
                          {(order.status === "pending" || order.status === "confirmed") && (
                            <CancelOrderButton orderId={order.id} onCancelled={() => fetchOrders()} />
                          )}
                          {order.status === "delivered" && (
                            <ReturnRequestButton orderId={order.id} />
                          )}
                          <span className={`text-xs px-3 py-1 ${
                            order.status === "delivered" ? "bg-green-100 text-green-700" :
                            order.status === "shipped" ? "bg-yellow-100 text-yellow-700" :
                            order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      {order.tracking_number && (
                        <p className="text-xs text-muted mt-2">
                          Tracking: {order.tracking_number}
                          {order.tracking_url && (
                            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline ml-1">Track</a>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="bg-[#efefef] p-8">
              <h2 className="font-bold text-ink text-xl mb-6">My Wishlist</h2>
              {loadingData ? (
                <p className="text-muted text-sm">Loading wishlist...</p>
              ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-8">
                  <HeartIcon size={40} className="text-line mx-auto mb-3" />
                  <p className="text-muted text-sm mb-4">Your wishlist is empty.</p>
                  <Link href="/products" className="btn-primary text-sm">Explore Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex gap-4 bg-white p-4 hover:bg-ink/5 transition-colors"
                    >
                      <div className="relative w-16 h-16 bg-[#efefef] flex-shrink-0">
                        <Image src={product.images?.[0] || ""} alt={product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{product.name}</p>
                        <p className="text-terracotta text-sm mt-0.5">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="bg-[#efefef] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-ink text-xl">Saved Addresses</h2>
                <button
                  onClick={() => { setEditingAddress(null); resetAddressForm(); setShowAddressForm(true); }}
                  className="btn-primary text-sm"
                >
                  Add Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={saveAddress} className="bg-white p-6 mb-6 space-y-4">
                  <h3 className="font-semibold text-ink">{editingAddress ? "Edit Address" : "New Address"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted block mb-1">Label</label>
                      <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink bg-white">
                        <option>Home</option><option>Office</option><option>Other</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-muted block mb-1">Address Line 1 *</label>
                      <input value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Address Line 2</label>
                    <input value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                      className="w-full border border-line px-3 py-2 text-sm text-ink" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted block mb-1">City *</label>
                      <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink" required />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">State *</label>
                      <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink" required />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1">Pincode *</label>
                      <input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full border border-line px-3 py-2 text-sm text-ink" required />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" checked={addressForm.is_default}
                      onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} />
                    Set as default address
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary text-sm">
                      {editingAddress ? "Update" : "Save"} Address
                    </button>
                    <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }}
                      className="btn-outline text-sm">Cancel</button>
                  </div>
                </form>
              )}

              {loadingData ? (
                <p className="text-muted text-sm">Loading addresses...</p>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-8">
                  <MapPinIcon size={40} className="text-line mx-auto mb-3" />
                  <p className="text-muted text-sm mb-4">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr: any) => (
                    <div key={addr.id} className="bg-white p-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider text-muted">{addr.label}</span>
                          {addr.is_default && (
                            <span className="text-[10px] bg-terracotta/10 text-terracotta px-2 py-0.5">Default</span>
                          )}
                        </div>
                        <p className="text-ink text-sm mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                        <p className="text-muted text-sm">{addr.city}, {addr.state} — {addr.pincode}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => editAddress(addr)} className="text-xs text-muted hover:text-terracotta">Edit</button>
                        <button onClick={() => deleteAddress(addr.id)} className="text-xs text-muted hover:text-red-500">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
