"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[#efefef] p-8 text-center">
        <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-bold text-ink text-lg mb-2">Thank You!</h3>
        <p className="text-muted text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#efefef] p-8">
      <h3 className="font-bold text-ink text-xl mb-6">Send us a Message</h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Full Name</label>
          <input
            type="text" required value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-terracotta"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Email Address</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-terracotta"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Phone Number</label>
          <input
            type="tel" value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-terracotta"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Message</label>
          <textarea
            required rows={5} value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full border border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-terracotta resize-none"
            placeholder="Tell us about your requirements..."
          />
        </div>
        {status === "error" && <p className="text-red-500 text-sm">{message}</p>}
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-50">
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
