"use client";

import { useState, useEffect } from "react";

export default function ReviewManager({ token }: { token: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setReviews(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function toggleApproval(id: string, current: boolean) {
    await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, is_approved: !current }),
    });
    fetchReviews();
  }

  async function deleteReview(id: string) {
    await fetch(`/api/admin/reviews?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReviews();
  }

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-16 bg-[#efefef]" />)}</div>;

  return (
    <div>
      <h2 className="font-bold text-ink text-xl mb-6">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-muted text-sm">No reviews yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted uppercase tracking-wider text-xs">
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Rating</th>
                <th className="text-left px-4 py-3 font-medium">Review</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b hover:bg-[#efefef]">
                  <td className="px-4 py-3 text-ink">{r.products?.name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{r.users?.name || "Anonymous"}</td>
                  <td className="px-4 py-3">{r.rating}/5</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="text-muted text-xs truncate">{r.body}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${r.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleApproval(r.id, r.is_approved)}
                        className="text-xs text-terracotta hover:underline"
                      >
                        {r.is_approved ? "Unapprove" : "Approve"}
                      </button>
                      <button onClick={() => deleteReview(r.id)} className="text-xs text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
