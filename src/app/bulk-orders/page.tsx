import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldIcon, TruckIcon, CreditCardIcon, PencilIcon, StarIcon, UsersIcon } from "@/components/icons";
import BulkOrderForm from "@/components/BulkOrderForm";

export const metadata: Metadata = {
  title: "Bulk & Corporate Orders | G-MART",
  description: "Special pricing & dedicated support for corporates, hotels, interior designers, and bulk buyers. G-MART — factory-direct furniture at scale.",
};

const INDUSTRIES = [
  { title: "Hotels & Resorts", items: ["Lobby furniture", "Guest room sets", "Restaurant & banquet seating", "Outdoor & poolside"], icon: "🏨" },
  { title: "Corporate Offices", items: ["Workstations & desks", "Executive cabins", "Meeting rooms", "Breakout areas"], icon: "🏢" },
  { title: "Interior Designers", items: ["Custom pieces", "Trade pricing", "Project management", "3D renders & specs"], icon: "🎨" },
  { title: "Real Estate Developers", items: ["Show apartments", "Clubhouse furnishing", "Common areas", "Turnkey solutions"], icon: "🏗️" },
  { title: "Co-working & Startups", items: ["Flexible seating", "Modular systems", "Quick turnaround", "Scalable plans"], icon: "💼" },
  { title: "Restaurants & Cafes", items: ["Dining sets", "Bar stools", "Outdoor seating", "Branded upholstery"], icon: "☕" },
];

const BENEFITS = [
  { icon: ShieldIcon, title: "Factory Direct Pricing", desc: "Eliminate middlemen. Buy straight from our 2,00,000 sq ft manufacturing facility." },
  { icon: PencilIcon, title: "Full Customization", desc: "Custom dimensions, fabrics, finishes, and branding — made to your exact spec." },
  { icon: TruckIcon, title: "Pan-India Logistics", desc: "White-glove delivery & installation across 500+ cities with dedicated project coordinators." },
  { icon: CreditCardIcon, title: "Flexible Payment Terms", desc: "Net 30/60/90, milestone-based payments, and project financing options." },
  { icon: StarIcon, title: "10-Year Warranty", desc: "Structural warranty on frames. Post-sale support with dedicated relationship managers." },
  { icon: UsersIcon, title: "Design Collaboration", desc: "Work with our in-house design team for space planning, 3D renders, and BOQ prep." },
];

const TRUSTED_LOGOS = ["TATA", "DLF", "LIVSPACE", "OYO", "GODREJ", "PRESTIGE"];

export default function BulkOrdersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-ink overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556409102-5e5b2c6b7e9a?w=1600&h=600&fit=crop"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-3 font-medium">B2B Partnerships</p>
          <h1 className="text-4xl md:text-6xl text-white leading-tight mb-6 font-bold">
            Bulk & Corporate Orders
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Factory-direct pricing, dedicated account management, and white-glove delivery for hotels, offices, interior designers & developers.
          </p>
          <a href="#inquiry-form" className="btn-primary scroll-smooth">
            Request a Quote
          </a>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16 bg-[#efefef]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-terracotta uppercase tracking-wider text-center mb-4 font-medium">TRUSTED BY</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {TRUSTED_LOGOS.map((logo) => (
              <span key={logo} className="font-bold text-ink text-lg">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why G-MART for B2B */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Why Partner With Us</p>
          <h2 className="section-title">Factory-Direct Advantage</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="text-center p-6">
              <b.icon size={40} className="mx-auto mb-4 text-terracotta" />
              <h3 className="font-bold text-ink text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-[#efefef] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Industries</p>
            <h2 className="section-title">We Serve</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INDUSTRIES.map((ind) => (
              <div key={ind.title} className="bg-white p-6 rounded-card border border-line">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{ind.icon}</span>
                  <h3 className="font-bold text-ink text-lg">{ind.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted">
                  {ind.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-terracotta">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="max-w-3xl mx-auto px-4 py-16">
        <BulkOrderForm />
      </section>

      {/* CTA */}
      <section className="py-16 bg-terracotta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-white/70 mb-8 text-sm">
            Fill out our brief inquiry form and our B2B team will reach out within 24 hours with a custom proposal.
          </p>
          <Link href="/contact" className="inline-block bg-white text-terracotta font-semibold px-8 py-3 rounded-button hover:bg-white/90 transition-colors">
            Get a Custom Quote
          </Link>
        </div>
      </section>
    </div>
  );
}