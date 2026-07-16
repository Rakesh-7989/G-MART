import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <section className="relative h-[70vh] min-h-[500px] bg-luxury-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/90 to-luxury-dark/50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <p className="text-luxury-gold uppercase tracking-[0.3em] text-sm mb-6">
              Premium Collection 2026
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
              Where Craftsmanship
              <br />
              <span className="text-luxury-gold">Meets Luxury</span>
            </h1>
            <p className="text-cream/70 text-lg mb-10 leading-relaxed">
              Handcrafted furniture that transforms your space into a masterpiece.
              Each piece is a testament to timeless artistry.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-primary">
                Explore Collection
              </Link>
              <Link href="/products?category=living-room" className="btn-outline border-white text-white hover:bg-white hover:text-luxury-dark">
                Living Room
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-luxury-gold uppercase tracking-[0.2em] text-sm mb-3">
            Curated for You
          </p>
          <h2 className="section-title">Featured Pieces</h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-luxury-brown/5 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl mb-4 text-luxury-gold">✦</div>
              <h3 className="font-serif text-xl text-luxury-brown mb-3">Handcrafted Excellence</h3>
              <p className="text-luxury-brown/60 text-sm leading-relaxed">
                Every piece is meticulously crafted by master artisans using time-honored techniques.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4 text-luxury-gold">✦</div>
              <h3 className="font-serif text-xl text-luxury-brown mb-3">Premium Materials</h3>
              <p className="text-luxury-brown/60 text-sm leading-relaxed">
                We source only the finest solid woods, Italian marbles, and pure fabrics.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4 text-luxury-gold">✦</div>
              <h3 className="font-serif text-xl text-luxury-brown mb-3">Free Delivery</h3>
              <p className="text-luxury-brown/60 text-sm leading-relaxed">
                Complimentary white-glove delivery and assembly across all major cities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative h-[400px] rounded overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/80 to-transparent" />
          <div className="relative h-full flex items-center px-10">
            <div className="max-w-md">
              <p className="text-luxury-gold uppercase tracking-[0.2em] text-sm mb-4">
                New Arrival
              </p>
              <h2 className="font-serif text-4xl text-white mb-4">
                Modern Living Collection
              </h2>
              <p className="text-cream/70 mb-8">
                Where contemporary design meets traditional craftsmanship.
              </p>
              <Link href="/products?category=living-room" className="btn-primary">
                Discover Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
