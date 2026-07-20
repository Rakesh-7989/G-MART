"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-14 h-14 mx-auto mb-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <h1 className="text-3xl text-[#050505] font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Something went wrong
          </h1>
          <p className="text-[#686868] text-sm mb-8 leading-relaxed">
            An unexpected error occurred. Please try again or return home.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="px-8 py-3 bg-[#050505] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ borderRadius: "32px" }}
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-8 py-3 border-2 border-[#050505] text-[#050505] font-semibold text-sm hover:bg-[#050505] hover:text-white transition-colors"
              style={{ borderRadius: "32px" }}
            >
              Go Home
            </a>
          </div>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-8 text-xs text-[#686868] font-mono text-left max-h-32 overflow-auto">
              {error.message}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
