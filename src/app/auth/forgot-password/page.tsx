"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  useEffect(() => {
  }, []);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await forgotPassword(email);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl text-ink font-bold mb-2">Reset Password</h1>
          <p className="text-muted text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="bg-terracotta/5 p-6 text-center">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
                <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <p className="text-ink font-medium mb-1">Check Your Email</p>
            <p className="text-muted text-sm">
              If an account exists for <strong className="text-ink">{email}</strong>,
              you&apos;ll receive a password reset link shortly.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted mt-6">
          <Link href="/auth/login" className="text-terracotta hover:underline font-medium">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
