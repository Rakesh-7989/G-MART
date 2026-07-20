import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">404</p>
      <h1 className="text-4xl text-ink font-bold mb-4">Page Not Found</h1>
      <p className="text-muted mb-8 max-w-md mx-auto">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/products" className="btn-outline">Browse Products</Link>
      </div>
    </div>
  );
}
