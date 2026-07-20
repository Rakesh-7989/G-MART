import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import USPSection from "@/components/USPSection";
import NewsletterForm from "@/components/NewsletterForm";
import { ShieldIcon, TruckIcon, CreditCardIcon, PencilIcon, StarIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&h=800&fit=crop",
    title: "Premium Collection 2026",
    subtitle: "Where Craftsmanship Meets Luxury",
    description: "Handcrafted furniture that transforms your space into a masterpiece.",
    cta: { text: "Explore Collection", href: "/products" },
    secondaryCta: { text: "Living Room", href: "/products?category=living-room" },
  },
  {
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&h=800&fit=crop",
    title: "Modern Living Collection",
    subtitle: "New Arrivals",
    description: "Where contemporary design meets traditional craftsmanship.",
    cta: { text: "Discover Now", href: "/products?category=living-room" },
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=800&fit=crop",
    title: "Design Your Dream Space",
    subtitle: "Custom Furniture",
    description: "Bespoke furniture tailored to your style, space, and comfort needs.",
    cta: { text: "Learn More", href: "/contact" },
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <HeroCarousel slides={HERO_SLIDES} />
      <USPSection />

      {/* Shop by Space */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">
            Browse by Room
          </p>
          <h2 className="section-title">Shop by Space</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Living Room", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop", slug: "living-room" },
            { name: "Bedroom", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&h=300&fit=crop", slug: "bedroom" },
            { name: "Dining", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop", slug: "dining" },
            { name: "Storage", image: "https://images.unsplash.com/photo-1597006335776-25b2fc72b0f8?w=300&h=300&fit=crop", slug: "storage" },
            { name: "Office", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=300&fit=crop", slug: "office" },
            { name: "Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop", slug: "decor" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group text-center"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden bg-card-bg mb-3 ring-2 ring-transparent group-hover:ring-terracotta transition-all">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
              </div>
              <span className="text-sm font-medium text-ink group-hover:text-terracotta transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="bg-[#efefef] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">
              Find What You Need
            </p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=500&fit=crop", slug: "sofas" },
              { name: "Beds", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=500&fit=crop", slug: "beds" },
              { name: "Dining Sets", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=500&fit=crop", slug: "dining" },
              { name: "Wardrobes", image: "https://images.unsplash.com/photo-1597006335776-25b2fc72b0f8?w=400&h=500&fit=crop", slug: "storage" },
              { name: "Coffee Tables", image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=500&fit=crop", slug: "living-room" },
              { name: "Shoe Racks", image: "https://images.unsplash.com/photo-1597006335776-25b2fc72b0f8?w=400&h=500&fit=crop", slug: "storage" },
              { name: "Office Furniture", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=500&fit=crop", slug: "office" },
              { name: "Decor", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop", slug: "decor" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.slug}`}
                className="group block relative aspect-[4/5] overflow-hidden rounded-card bg-card-bg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#efefef] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">
              Curated for You
            </p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: ShieldIcon, title: "Handcrafted Excellence", desc: "Every piece is meticulously crafted by master artisans using time-honored techniques." },
            { icon: StarIcon, title: "Premium Materials", desc: "We source only the finest solid woods, Italian marbles, and pure fabrics." },
            { icon: TruckIcon, title: "Free Delivery", desc: "Complimentary white-glove delivery and assembly across all major cities." },
            { icon: CreditCardIcon, title: "Easy Financing", desc: "Flexible EMI options and no-cost financing to make your dream home a reality." },
          ].map((item) => (
            <div key={item.title}>
              <div className="flex justify-center mb-4">
                <item.icon size={32} className="text-terracotta" />
              </div>
              <h3 className="font-bold text-ink text-lg mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">Handmade in India</p>
            <h2 className="text-3xl text-ink font-bold mb-6">Craftsmanship That Lasts Generations</h2>
            <div className="text-muted text-sm leading-relaxed space-y-4">
              <p>G-MART was founded with a single vision — to bring the finest handcrafted furniture to every Indian home. What started as a small workshop has grown into a trusted name in premium furniture, serving thousands of happy customers across the country.</p>
              <p>Every piece at G-MART tells a story. From the selection of the finest solid woods to the meticulous hand-finishing by master artisans, we take pride in creating furniture that is not just beautiful, but built to last for generations.</p>
              <p>Our in-house factory allows us to maintain complete control over quality while offering factory-direct pricing — ensuring you get the best value without compromising on craftsmanship.</p>
            </div>
          </div>
          <div className="aspect-[4/3] bg-card-bg rounded-card overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop)" }}
            />
          </div>
        </div>
      </section>

      {/* Custom Furniture Process */}
      <section className="bg-[#efefef] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-3 font-medium">Custom Furniture</p>
            <h2 className="section-title">How Custom Furniture Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { step: "01", title: "Share Your Idea", desc: "Tell us your vision — sketches, photos, or just a description. Our designers will refine it with you." },
              { step: "02", title: "Design & Quote", desc: "Get 3D renders, material samples, and a detailed quote within 48 hours. Unlimited revisions." },
              { step: "03", title: "Build With Care", desc: "Handcrafted in our factory using premium materials. Progress updates at every stage." },
              { step: "04", title: "Deliver & Enjoy", desc: "White-glove delivery, assembly, and placement. 10-year warranty on frame/structure." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-14 h-14 mx-auto mb-4 bg-terracotta text-white rounded-full flex items-center justify-center font-bold text-xl">{item.step}</div>
                <h3 className="font-bold text-ink text-lg mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-terracotta">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-white/80 uppercase tracking-wider text-xs mb-3 font-medium">
            Design notes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Inspired With G-MART
          </h2>
          <p className="text-white/70 mb-8 text-sm">
            Get updates on new arrivals, offers & design inspiration.
          </p>
          <NewsletterForm variant="terracotta" />
          <div className="flex justify-center gap-6 mt-8 text-white/80 text-xs">
            <span>✦ Exclusive Offers</span>
            <span>✦ New Arrivals</span>
            <span>✦ Design Ideas</span>
          </div>
        </div>
      </section>
    </div>
  );
}
