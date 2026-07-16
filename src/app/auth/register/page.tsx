"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const name = `${form.firstName} ${form.lastName}`.trim();
    const err = await signUp(form.email, form.password, name, form.phone);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      router.push("/account");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-luxury-brown mb-2">Create Account</h1>
          <p className="text-luxury-brown/60">Join the G-MART family</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          </div>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-luxury-brown/60 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-luxury-gold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
