import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | G-MART",
  description: "Frequently asked questions about G-MART's ordering, shipping, returns, and more.",
};

const faqs = [
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD) and online payments via Credit/Debit Card, UPI, and Net Banking through our secure payment partner Cashfree." },
  { q: "How long does shipping take?", a: "Orders are typically processed within 1-2 business days. Shipping takes 5-10 business days depending on your location. We offer free shipping on all orders across India." },
  { q: "What is your return policy?", a: "We accept returns on delivered orders within 7 days of delivery. Items must be in original condition. Please visit our Return Policy page for full details." },
  { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking number via email. You can use this to track your order on the courier partner's website." },
  { q: "Do you offer international shipping?", a: "Currently, we ship only within India. We are working on expanding to international destinations." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled while they are in 'pending' or 'confirmed' status. Once shipped, cancellation is not possible. Contact us immediately if you need to cancel." },
  { q: "Is my payment information secure?", a: "Yes. We use Cashfree, a PCI-DSS compliant payment gateway. Your payment details are encrypted and never stored on our servers." },
  { q: "Do you offer warranty on furniture?", a: "All our furniture comes with a 1-year manufacturing warranty against defects. This does not cover damage caused by misuse or normal wear and tear." },
  { q: "How do I care for my furniture?", a: "We recommend dusting regularly with a soft cloth, avoiding direct sunlight, and using coasters for drinks. Each product page has specific care instructions." },
  { q: "Can I request a custom piece?", a: "Yes! We offer custom furniture orders for select products. Contact us via email or WhatsApp with your requirements and we'll provide a quote." },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Help</p>
        <h1 className="text-3xl text-ink font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group border border-line">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-ink font-medium text-sm hover:bg-[#efefef] transition-colors">
              {faq.q}
              <svg
                className="w-4 h-4 text-muted group-open:rotate-180 transition-transform flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-6 py-4 border-t border-line text-muted text-sm leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
