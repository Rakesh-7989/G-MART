import type { Metadata } from "next";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@/components/icons";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | G-MART",
  description: "Get in touch with G-MART. Visit our Mumbai showroom, call us, or send a message. We're here to help with custom orders and design advice.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-48 md:h-56 bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <p className="text-terracotta uppercase tracking-[0.3em] text-xs mb-3 font-medium">Get in Touch</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6">We&apos;d Love to Hear from You</h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              Our team is here to help with any questions, custom orders, or design advice.
              Reach out to us and we&apos;ll get back to you promptly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPinIcon size={18} className="text-terracotta" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">Visit Our Showroom</h3>
                  <p className="text-muted text-sm mt-1">
                    123 Furniture Lane, Design District<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneIcon size={18} className="text-terracotta" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">Call Us</h3>
                  <p className="text-muted text-sm mt-1">
                    +91 99999 99999<br />
                    Mon-Sat, 10 AM - 7 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon size={18} className="text-terracotta" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">Email Us</h3>
                  <p className="text-muted text-sm mt-1">
                    hello@gmart.com<br />
                    We respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
