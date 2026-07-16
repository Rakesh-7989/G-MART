import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-luxury-brown mb-2">Welcome Back</h1>
          <p className="text-luxury-brown/60">Sign in to your account</p>
        </div>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          <input type="password" placeholder="Password" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
        <p className="text-center text-sm text-luxury-brown/60 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-luxury-gold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
