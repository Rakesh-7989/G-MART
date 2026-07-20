"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">Error</p>
      <h1 className="text-3xl text-ink font-bold mb-4">Something went wrong</h1>
      <p className="text-muted mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button onClick={reset} className="btn-primary">
        Try Again
      </button>
    </div>
  );
}
