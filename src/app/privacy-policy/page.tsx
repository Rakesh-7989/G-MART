import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | G-MART",
  description: "G-MART privacy policy explaining how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Legal</p>
        <h1 className="text-3xl text-ink font-bold">Privacy Policy</h1>
      </div>

      <div className="space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-ink font-semibold text-base mb-2">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, placing an order, or contacting us — including your name, email address, phone number, shipping address, and payment details. We also automatically collect certain technical data such as IP address, browser type, and browsing behavior to improve our services.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">2. How We Use Your Information</h2>
          <p>Your information is used to process orders, deliver products, send order updates, respond to inquiries, improve our website, and send promotional offers (with your consent). We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">3. Payment Information</h2>
          <p>All payment transactions are processed securely through our payment partner (Cashfree). We do not store your full card details on our servers. Payment data is encrypted and handled in compliance with PCI DSS standards.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">4. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect certain features of our website.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">5. Data Retention</h2>
          <p>We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us. We will delete your data within 30 days of your request, subject to legal requirements.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time. To exercise these rights, please contact our support team.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">7. Contact</h2>
          <p>For privacy-related inquiries, contact us at support@gmart.in or call +91-99999-99999.</p>
        </section>
      </div>
    </div>
  );
}
