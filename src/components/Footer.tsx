import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-luxury-dark text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-serif text-2xl text-cream mb-4">
              G<span className="text-luxury-gold">-</span>MART
            </h3>
            <p className="text-sm leading-relaxed">
              Premium handcrafted furniture since 2024. Every piece tells a story of
              exquisite craftsmanship and timeless design.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-cream mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/products" className="hover:text-luxury-gold transition-colors">All Products</Link>
              <Link href="/products?category=living-room" className="hover:text-luxury-gold transition-colors">Living Room</Link>
              <Link href="/products?category=dining" className="hover:text-luxury-gold transition-colors">Dining</Link>
              <Link href="/products?category=bedroom" className="hover:text-luxury-gold transition-colors">Bedroom</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-cream mb-4 uppercase tracking-wider">
              Support
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/auth/login" className="hover:text-luxury-gold transition-colors">My Account</Link>
              <Link href="/cart" className="hover:text-luxury-gold transition-colors">Cart</Link>
              <Link href="/products" className="hover:text-luxury-gold transition-colors">Help & FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-cream mb-4 uppercase tracking-wider">
              Company
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
              <Link href="/products" className="hover:text-luxury-gold transition-colors">Collection</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-center text-sm text-cream/60">
          &copy; {new Date().getFullYear()} G-MART. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
