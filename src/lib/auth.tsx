"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string | null>;
  resetPassword: (password: string) => Promise<string | null>;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  forgotPassword: async () => null,
  resetPassword: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gmart_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function setSession(data: { user: any; session: any }) {
    if (data.session?.access_token) {
      localStorage.setItem("gmart_token", data.session.access_token);
    }
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        phone: data.user.user_metadata?.phone || "",
      });
    }
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) return data.error;
    setSession(data);
    return null;
  }

  async function signUp(email: string, password: string, name?: string, phone?: string): Promise<string | null> {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone }),
    });
    const data = await res.json();
    if (data.error) return data.error;
    if (data.session) setSession(data);
    return null;
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    localStorage.removeItem("gmart_token");
    setUser(null);
  }

  async function forgotPassword(email: string): Promise<string | null> {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.error || null;
  }

  async function resetPassword(password: string): Promise<string | null> {
    const token = localStorage.getItem("gmart_token");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    return data.error || null;
  }

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signUp, signOut, forgotPassword, resetPassword }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
