"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-white p-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-white/80 flex-1">
          We use cookies to enhance your experience. By continuing, you agree to our{" "}
          <Link href="/privacy-policy" className="text-terracotta hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-sm !px-6 !py-2">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
