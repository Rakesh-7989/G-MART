"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-luxury-brown/60">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-luxury-brown mb-4">Please Sign In</h1>
        <Link href="/auth/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-luxury-brown mb-10">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="flex flex-row md:flex-col gap-2 md:space-y-1 overflow-x-auto">
          {[
            { label: "Profile", icon: User, href: "#", active: true },
            { label: "Orders", icon: Package, href: "#" },
            { label: "Addresses", icon: MapPin, href: "#" },
            { label: "Sign Out", icon: LogOut, href: "#", action: signOut },
          ].map(({ label, icon: Icon, active, action }) => (
            <button
              key={label}
              onClick={action}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap text-left w-full ${
                active
                  ? "bg-luxury-gold/10 text-luxury-gold border-l-2 border-luxury-gold"
                  : "text-luxury-brown/60 hover:text-luxury-brown hover:bg-luxury-brown/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3">
          <div className="bg-white border border-luxury-gold/20 p-8">
            <h2 className="font-serif text-xl text-luxury-brown mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Name</p>
                <p className="text-luxury-brown">{user.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Email</p>
                <p className="text-luxury-brown">{user.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-luxury-brown/40 mb-1">Phone</p>
                <p className="text-luxury-brown">{user.phone || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
