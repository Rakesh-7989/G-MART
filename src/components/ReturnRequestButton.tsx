"use client";

import { useState } from "react";

export default function ReturnRequestButton({ orderId }: { orderId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: orderId, reason }),
      });
      if (res.ok) {
        setDone(true);
        setShowForm(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit return request");
      }
    } catch {
      setError("Failed to submit return request");
    }
    setSubmitting(false);
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="text-xs text-orange-600 hover:underline"
      >
        Return
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full">
            {done ? (
              <div className="text-center">
                <p className="text-green-700 font-medium mb-2">Return request submitted!</p>
                <p className="text-sm text-muted mb-4">We will review and get back to you.</p>
                <button onClick={() => setShowForm(false)} className="btn-primary text-sm">Close</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="font-semibold text-ink mb-2">Request Return</h3>
                <p className="text-xs text-muted mb-4">Order #{orderId.slice(0, 8)}</p>
                <textarea
                  placeholder="Tell us why you'd like to return this item..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-line px-3 py-2 text-sm text-ink mb-3"
                  rows={4}
                  required
                />
                {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary text-sm">
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
