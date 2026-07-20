import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return Policy | G-MART",
  description: "G-MART return and exchange policy. Easy returns within 7 days of delivery.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-terracotta uppercase tracking-[0.2em] text-sm mb-2 font-medium">Policies</p>
        <h1 className="text-3xl text-ink font-bold">Return & Exchange Policy</h1>
      </div>

      <div className="space-y-8 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-ink font-semibold text-base mb-2">1. Return Window</h2>
          <p>We accept returns within <strong>7 days</strong> of delivery. Items must be unused, in original packaging, and in the same condition as received. Custom-made products are not eligible for returns unless there is a manufacturing defect.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">2. Eligibility</h2>
          <p>To be eligible for a return, your item must be unused and in the same condition you received it. It must also be in the original packaging. Items marked as "Final Sale" or custom-made cannot be returned.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">3. Return Process</h2>
          <p>To initiate a return, log in to your account and navigate to your orders, or contact our support team. We will arrange for pickup from your shipping address. Once the item is received and inspected, we will notify you about the approval or rejection of your refund.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">4. Refunds</h2>
          <p>Once your return is received and inspected, we will process your refund within 5-7 business days. Refunds are issued to the original payment method. COD orders will be refunded via bank transfer. Shipping charges are non-refundable.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">5. Exchanges</h2>
          <p>If you received a defective or damaged item, we will exchange it at no additional cost. Please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund.</p>
        </section>

        <section>
          <h2 className="text-ink font-semibold text-base mb-2">6. Cancellations</h2>
          <p>Orders can be cancelled before dispatch. Once dispatched, cancellation is subject to our return policy. To cancel, visit your account orders page or <Link href="/contact" className="text-terracotta hover:underline">contact us</Link>.</p>
        </section>
      </div>
    </div>
  );
}
