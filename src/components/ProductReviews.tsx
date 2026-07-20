"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { StarIcon } from "@/components/icons";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: boolean;
  created_at: string;
  users: { name: string } | null;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) setReviews(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, product_id: productId }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ rating: 5, title: "", body: "" });
        fetchReviews();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Failed to submit review");
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">
            Reviews
          </p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        {user && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-outline text-sm">
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submitReview} className="bg-[#efefef] p-6 mb-8">
          <h3 className="font-semibold text-ink mb-4">Write Your Review</h3>
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}>
                <StarIcon
                  size={20}
                  className={star <= form.rating ? "text-ink" : "text-line"}
                  fill={star <= form.rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Review title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-line px-3 py-2 text-sm text-ink mb-3"
          />
          <textarea
            placeholder="Share your experience with this product..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full border border-line px-3 py-2 text-sm text-ink mb-3"
            rows={4}
            required
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary text-sm">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#efefef]" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-line pb-6">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    size={14}
                    className={i < review.rating ? "text-ink" : "text-line"}
                    fill={i < review.rating ? "currentColor" : "none"}
                  />
                ))}
                {review.verified_purchase && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 ml-2">Verified Purchase</span>
                )}
              </div>
              {review.title && (
                <p className="font-semibold text-ink text-sm mb-1">{review.title}</p>
              )}
              <p className="text-muted text-sm">{review.body}</p>
              <p className="text-xs text-muted mt-2">
                {review.users?.name || "Anonymous"} — {new Date(review.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
