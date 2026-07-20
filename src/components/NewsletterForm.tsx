"use client";

import { useState } from "react";

export default function NewsletterForm({
  variant = "dark",
}: {
  variant?: "dark" | "terracotta";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Subscribed!");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (variant === "terracotta") {
    return (
      <form className="flex gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 text-sm text-ink bg-white outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#b9492e", borderRadius: "var(--radius-button)" }}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <form className="max-w-md mx-auto flex gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2.5 text-sm text-ink bg-white outline-none"
        required
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary whitespace-nowrap disabled:opacity-50">
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
