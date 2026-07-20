"use client";

import { useState } from "react";

export default function CancelOrderButton({ orderId, onCancelled }: { orderId: string; onCancelled: () => void }) {
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("gmart_token");
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onCancelled();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel");
      }
    } catch {
      alert("Failed to cancel order");
    }
    setCancelling(false);
  }

  return (
    <button
      onClick={handleCancel}
      disabled={cancelling}
      className="text-xs text-red-500 hover:underline disabled:opacity-50"
    >
      {cancelling ? "..." : "Cancel"}
    </button>
  );
}
