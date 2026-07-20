"use client";

import { useState } from "react";
import { TruckIcon } from "./icons";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  async function handleCheck() {
    if (pincode.length !== 6) return;
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 800));
    const available = ["110001", "110030", "122001", "201301", "121008", "560001", "400001", "700001"].includes(pincode);
    setStatus(available ? "available" : "unavailable");
  }

  return (
    <div className="py-4">
      <p className="text-xs font-medium text-ink mb-2 flex items-center gap-1.5">
        <TruckIcon size={14} />
        Delivery Availability
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setStatus("idle"); }}
          className="flex-1 border border-line px-3 py-2 text-sm focus:outline-none focus:border-terracotta"
        />
        <button
          onClick={handleCheck}
          disabled={pincode.length !== 6 || status === "checking"}
          className="btn-primary !px-4 !py-2 !text-xs disabled:opacity-50"
        >
          {status === "checking" ? "..." : "Check"}
        </button>
      </div>
      {status === "available" && (
        <p className="text-xs text-green-600 mt-2">✓ Delivered to {pincode}</p>
      )}
      {status === "unavailable" && (
        <p className="text-xs text-red-500 mt-2">✗ Currently unavailable in {pincode}</p>
      )}
    </div>
  );
}
