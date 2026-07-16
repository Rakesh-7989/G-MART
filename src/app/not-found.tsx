import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-7xl text-luxury-gold mb-4">404</h1>
        <h2 className="font-serif text-2xl text-luxury-brown mb-4">Page Not Found</h2>
        <p className="text-luxury-brown/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
