import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import {
  PhoneIcon,
  PencilIcon,
  ShieldIcon,
  BuildingIcon,
  InstagramIcon,
  FacebookIcon,
  XLogoIcon,
  LinkedinIcon,
  TruckIcon,
  BoxIcon,
  CreditCardIcon,
  StarIcon,
  EnvelopeIcon,
} from "./icons";

export default function Footer() {
  return (
    <footer className="mt-20">
      {/* Value Strip */}
      <div className="bg-[#efefef] border-y border-line">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: PhoneIcon, title: "Factory Direct Value", desc: "Best quality at the best price" },
              { icon: PencilIcon, title: "Custom-Made Options", desc: "Tailored to your style and comfort" },
              { icon: ShieldIcon, title: "Durable & Reliable", desc: "Long-lasting furniture with top-grade craftsmanship" },
              { icon: BuildingIcon, title: "Bulk & Corporate Orders", desc: "Special pricing & dedicated support for businesses" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="flex justify-center mb-3">
                  <item.icon size={24} className="text-terracotta" />
                </div>
                <h4 className="font-semibold text-ink text-sm mb-1">{item.title}</h4>
                <p className="text-muted text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div>
              <h3 className="font-bold text-xl mb-4">G-MART</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Premium furniture, crafted for comfort, designed for your lifestyle.
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <a href="tel:+919319574949" className="flex items-center gap-2 hover:text-terracotta transition-colors">
                  <PhoneIcon size={14} />
                  +91 9319574949
                </a>
                <a href="mailto:info@g-mart.com" className="flex items-center gap-2 hover:text-terracotta transition-colors">
                  <EnvelopeIcon size={14} />
                  info@g-mart.com
                </a>
                <p className="flex items-center gap-2">
                  <StarIcon size={14} />
                  Open Daily: 10:00 AM - 9:00 PM
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="https://instagram.com/gmart" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-terracotta transition-colors" aria-label="Instagram">
                  <InstagramIcon size={18} />
                </a>
                <a href="https://facebook.com/gmart" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-terracotta transition-colors" aria-label="Facebook">
                  <FacebookIcon size={18} />
                </a>
                <a href="https://youtube.com/@gmart" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-terracotta transition-colors" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.5 6.2c-.3-1-1-1.7-2-2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.5.7c-1 .3-1.7 1-2 2C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.7 2 2 2 .7 9.5.7 9.5.7s7.5 0 9.5-.7c1-.3 1.7-1 2-2 .5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link href="/about" className="hover:text-terracotta transition-colors">About Us</Link>
                <Link href="/blog" className="hover:text-terracotta transition-colors">Blog</Link>
                <Link href="/products" className="hover:text-terracotta transition-colors">All Products</Link>
                <Link href="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link>
                <Link href="/contact" className="hover:text-terracotta transition-colors">Franchise Inquiry</Link>
                <Link href="/bulk-orders" className="hover:text-terracotta transition-colors font-medium">Bulk / Corporate Orders</Link>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link href="/products?category=living-room" className="hover:text-terracotta transition-colors">Living Room</Link>
                <Link href="/products?category=dining" className="hover:text-terracotta transition-colors">Dining</Link>
                <Link href="/products?category=storage" className="hover:text-terracotta transition-colors">Storage</Link>
                <Link href="/products?category=bedroom" className="hover:text-terracotta transition-colors">Bedroom</Link>
                <Link href="/products?category=office" className="hover:text-terracotta transition-colors">Office & Study</Link>
                <Link href="/products?category=decor" className="hover:text-terracotta transition-colors">Decor</Link>
              </div>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Customer Support</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link href="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link>
                <Link href="/faq" className="hover:text-terracotta transition-colors">FAQ</Link>
                <Link href="/return-policy" className="hover:text-terracotta transition-colors">Return Policy</Link>
                <Link href="/shipping-policy" className="hover:text-terracotta transition-colors">Shipping Policy</Link>
                <Link href="/terms" className="hover:text-terracotta transition-colors">Terms of Service</Link>
                <Link href="/privacy-policy" className="hover:text-terracotta transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-white/10 mt-10 pt-10 text-center">
            <h4 className="font-semibold text-lg mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-white/60 mb-6">Get updates on new arrivals, offers & design inspiration.</p>
            <NewsletterForm variant="dark" />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/50">
                &copy; {new Date().getFullYear()} G-MART. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {[
                  { icon: CreditCardIcon, label: "Secure Payments" },
                  { icon: BoxIcon, label: "Easy Returns" },
                  { icon: TruckIcon, label: "Pan-India Delivery" },
                  { icon: CreditCardIcon, label: "No Cost EMI" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-white/50 text-xs">
                    <item.icon size={14} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
