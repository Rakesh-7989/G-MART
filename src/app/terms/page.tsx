import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | G-MART",
  description: "Terms and conditions for using G-MART website and services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Legal</p>
        <h1 className="text-3xl text-ink font-bold">Terms of Service</h1>
      </div>

      <div className="space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-ink font-semibold text-base mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using G-MART website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">2. Products & Pricing</h2>
          <p>All product images are for illustration purposes. Actual products may vary slightly. Prices are subject to change without notice. We reserve the right to cancel orders in case of pricing errors.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">3. Orders & Payment</h2>
          <p>When you place an order, you agree to provide accurate and complete information. Payment is due at the time of order for online payments or upon delivery for COD. Orders are subject to availability.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">4. Shipping & Delivery</h2>
          <p>We ship across India. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery. Additional delivery charges may apply for remote locations.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">5. Returns & Refunds</h2>
          <p>Our return policy is outlined on the <Link href="/return-policy" className="text-terracotta hover:underline">Return Policy</Link> page. Refunds are processed within 5-7 business days after approval.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">6. Intellectual Property</h2>
          <p>All content on this website — including images, text, logos, and designs — is the property of G-MART and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">7. Limitation of Liability</h2>
          <p>G-MART shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">8. Contact</h2>
          <p>For questions about these terms, please <Link href="/contact" className="text-terracotta hover:underline">contact us</Link>.</p>
        </section>
      </div>
    </div>
  );
}
