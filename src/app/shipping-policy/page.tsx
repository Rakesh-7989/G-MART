import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | G-MART",
  description: "G-MART shipping policy. Free delivery across India with white-glove service in major cities.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Policies</p>
        <h1 className="text-3xl text-ink font-bold">Shipping Policy</h1>
      </div>

      <div className="space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-ink font-semibold text-base mb-2">1. Delivery Areas</h2>
          <p>We offer pan-India delivery. Free shipping is available on all orders above ₹5,000. For orders below ₹5,000, a flat shipping fee of ₹199 applies. White-glove delivery (unboxing, assembly, placement) is available in select metro cities.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">2. Delivery Timeline</h2>
          <p>Stocked items are dispatched within 2-3 business days and delivered within 5-7 business days. Custom-made and made-to-order items require 10-15 business days for manufacturing. You will receive a tracking number once your order is dispatched.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">3. Shipping Charges</h2>
          <p>We provide free shipping on orders over ₹5,000. A nominal fee of ₹199 is charged for orders below this amount. Additional charges may apply for remote locations or oversized items, which will be communicated before order confirmation.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">4. Order Tracking</h2>
          <p>Once your order is dispatched, you will receive an email and SMS with tracking details. You can also track your order from your account dashboard. For any shipping-related queries, contact our support team.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">5. Damaged in Transit</h2>
          <p>If your order arrives damaged, please notify us within 48 hours of delivery with photographs. We will arrange a free replacement or full refund. Please inspect all packages at the time of delivery.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">6. International Shipping</h2>
          <p>Currently, we ship within India only. International shipping is not available at this time. For bulk export inquiries, please contact our B2B team.</p>
        </section>
      </div>
    </div>
  );
}
