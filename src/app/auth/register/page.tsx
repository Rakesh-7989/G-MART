import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-luxury-brown mb-2">Create Account</h1>
          <p className="text-luxury-brown/60">Join the G-MART family</p>
        </div>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
            <input type="text" placeholder="Last Name" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          </div>
          <input type="email" placeholder="Email" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          <input type="tel" placeholder="Phone" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" />
          <input type="password" placeholder="Password" className="w-full p-3 border border-luxury-gold/20 bg-white focus:outline-none focus:border-luxury-gold" required />
          <button type="submit" className="btn-primary w-full">Create Account</button>
        </form>
        <p className="text-center text-sm text-luxury-brown/60 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-luxury-gold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
