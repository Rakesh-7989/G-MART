import type { Metadata } from "next";
import Link from "next/link";
import { ShieldIcon, StarIcon, TruckIcon, CreditCardIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us | G-MART",
  description: "G-MART — premium handcrafted furniture since 2024. Our story, values, and commitment to quality craftsmanship.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-ink overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&h=600&fit=crop)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-3">Est. 2024</p>
          <h1 className="text-4xl md:text-6xl text-white font-bold">Our Story</h1>
        </div>
      </section>

      {/* Brand Narrative */}
      <section className="max-w-4xl mx-auto px-4 py-16">
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

      {/* Values */}
      <section className="bg-[#efefef] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why G-MART</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: ShieldIcon, title: "Premium Quality", desc: "Only the finest materials — solid wood, Italian marble, top-grade fabrics." },
              { icon: StarIcon, title: "Master Craftsmanship", desc: "Each piece is hand-finished by artisans with decades of experience." },
              { icon: TruckIcon, title: "Pan-India Delivery", desc: "Free white-glove delivery and assembly across all major cities." },
              { icon: CreditCardIcon, title: "Factory Direct Pricing", desc: "No middlemen. You get the best price directly from our factory." },
            ].map((v) => (
              <div key={v.title}>
                <v.icon size={36} className="mx-auto mb-4 text-terracotta" />
                <h3 className="text-lg font-bold text-ink mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl text-ink font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-muted text-sm mb-8">Browse our collection or visit our showroom to experience the quality firsthand.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/products" className="btn-primary">Shop Now</Link>
          <Link href="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
