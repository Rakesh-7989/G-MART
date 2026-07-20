"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { useCallback } from "react";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        sp.delete("page");
      } else {
        sp.set("page", String(page));
      }
      router.push(`/products?${sp.toString()}`);
    },
    [router, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const delta = 2;
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (rangeStart > 2) pages.push("...");
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon size={18} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`w-9 h-9 text-sm transition-colors ${
              p === currentPage
                ? "bg-ink text-white"
                : "text-ink hover:bg-[#efefef]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
