"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let token = searchParams.get("token") || localStorage.getItem("gmart_token");
    if (!token && typeof window !== "undefined") {
      const hash = window.location.hash;
      const match = hash.match(/access_token=([^&]+)/);
      if (match) token = match[1];
    }
    if (token) {
      if (!localStorage.getItem("gmart_token")) {
        localStorage.setItem("gmart_token", token);
      }
      setHasToken(true);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const err = await resetPassword(password);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  }

  if (!hasToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl text-ink font-bold mb-4">Invalid Link</h1>
          <p className="text-muted mb-8">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/auth/forgot-password" className="btn-primary">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
              <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h1 className="text-2xl text-ink font-bold mb-2">Password Reset!</h1>
          <p className="text-muted text-sm">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl text-ink font-bold mb-2">Set New Password</h1>
          <p className="text-muted text-sm">
            Choose a strong password for your account.
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password" placeholder="New Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required minLength={6}
          />
          <input
            type="password" placeholder="Confirm Password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 border border-line bg-white focus:outline-none focus:border-terracotta text-sm" required minLength={6}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <p className="text-muted">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
