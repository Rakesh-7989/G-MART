"use client";

import { useState } from "react";
import Link from "next/link";

const INDUSTRIES = [
  { title: "Hotels & Resorts", value: "Hotels & Resorts" },
  { title: "Corporate Offices", value: "Corporate Offices" },
  { title: "Interior Designers", value: "Interior Designers" },
  { title: "Real Estate Developers", value: "Real Estate Developers" },
  { title: "Co-working & Startups", value: "Co-working & Startups" },
  { title: "Restaurants & Cafes", value: "Restaurants & Cafes" },
];

export default function BulkOrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    projectType: "",
    quantity: "",
    timeline: "",
    budget: "",
    message: "",
    products: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      setStatus("success");
      setFormData({
        name: "", email: "", phone: "", company: "", industry: "", projectType: "",
        quantity: "", timeline: "", budget: "", message: "", products: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Get a Quote</p>
        <h2 className="section-title">Start Your Project</h2>
        <p className="text-muted text-sm mt-2 max-w-xl mx-auto">
          Fill out the form below and our B2B team will reach out within 24 hours with a custom proposal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-card border border-line" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="work@company.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-ink mb-2">Company Name *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="Company name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-ink mb-2">Industry</label>
            <select id="industry" name="industry" value={formData.industry} onChange={handleChange} className="input-field w-full">
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i.value} value={i.value}>{i.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-ink mb-2">Project Type</label>
            <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className="input-field w-full">
              <option value="">Select project type</option>
              <option value="new-build">New Build / Fit-out</option>
              <option value="refurbishment">Refurbishment</option>
              <option value="expansion">Expansion</option>
              <option value="showroom">Showroom / Model Unit</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-ink mb-2">Estimated Quantity</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="e.g., 50 workstations, 20 sofas"
            />
          </div>
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-ink mb-2">Timeline</label>
            <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className="input-field w-full">
              <option value="">Select timeline</option>
              <option value="asap">ASAP</option>
              <option value="1-3-months">1-3 months</option>
              <option value="3-6-months">3-6 months</option>
              <option value="6-12-months">6-12 months</option>
              <option value="planning">Planning stage</option>
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-ink mb-2">Budget Range</label>
            <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className="input-field w-full">
              <option value="">Select budget</option>
              <option value="under-10L">Under ₹10 Lakhs</option>
              <option value="10L-50L">₹10 - 50 Lakhs</option>
              <option value="50L-1Cr">₹50 Lakhs - 1 Crore</option>
              <option value="1Cr-5Cr">₹1 - 5 Crore</option>
              <option value="5Cr+">₹5 Crore+</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="products" className="block text-sm font-medium text-ink mb-2">Products of Interest</label>
          <textarea
            id="products"
            name="products"
            value={formData.products}
            onChange={handleChange}
            rows={2}
            className="input-field w-full"
            placeholder="e.g., Executive desks, ergonomic chairs, modular sofas, dining sets"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">Project Details</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="input-field w-full"
            placeholder="Tell us about your project — space, style preferences, special requirements, etc."
          />
        </div>

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center">
            ✓ Thank you! Your inquiry has been submitted. Our B2B team will contact you within 24 hours.
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-center">
            ✕ {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full md:w-auto btn-primary py-3 px-8 text-lg"
        >
          {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
        </button>

        <p className="text-xs text-muted text-center">
          By submitting, you agree to our <Link href="/privacy-policy" className="underline hover:text-terracotta">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}