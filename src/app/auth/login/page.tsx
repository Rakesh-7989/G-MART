"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await signIn(email, password);
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
          <h1 className="font-serif text-3xl text-luxury-brown mb-2">Welcome Back</h1>
          <p className="text-luxury-brown/60">Sign in to your account</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-luxury-brown/60 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-luxury-gold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
