import { Resend } from "resend";
import { generateInvoiceBuffer } from "./invoice";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM = "G-MART <noreply@gmart.in>";
const ADMIN_EMAIL = "boyapatirakesh7777@gmail.com";

export async function sendOrderConfirmation(order: {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: Record<string, any>;
  created_at: string;
  order_items: { product_name: string; quantity: number; price: number }[];
}) {
  const itemsHtml = order.order_items
    .map((i) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${i.product_name}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${i.price.toLocaleString("en-IN")}</td></tr>`)
    .join("");

  const addr = order.shipping_address;
  const addrHtml = addr
    ? `${addr.line1 || addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} ${addr.pincode || addr.zip || ""}`
    : "N/A";

  let invoiceBuffer: Buffer | undefined;
  try {
    invoiceBuffer = await generateInvoiceBuffer(order);
  } catch { /* fallback: send without attachment */ }

  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `Order Confirmed — #${order.id.slice(0, 8)}`,
    attachments: invoiceBuffer
      ? [{ filename: `invoice-${order.id.slice(0, 8)}.pdf`, content: invoiceBuffer }]
      : undefined,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 8px">Thank you, ${order.customer_name}!</h1>
      <p style="color:#555;margin:0 0 24px">Your order <strong>#${order.id.slice(0, 8)}</strong> has been placed successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead><tr style="background:#f5f5f5"><th style="padding:8px 12px;text-align:left">Item</th><th style="padding:8px 12px;text-align:center">Qty</th><th style="padding:8px 12px;text-align:right">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot><tr><td colspan="2" style="padding:8px 12px;text-align:right;font-weight:600">Total</td><td style="padding:8px 12px;text-align:right;font-weight:600">₹${order.total.toLocaleString("en-IN")}</td></tr></tfoot>
      </table>
      <p style="color:#555;margin:0 0 8px"><strong>Payment:</strong> ${order.payment_method === "cashfree" ? "Online (Paid)" : "Cash on Delivery"}</p>
      <p style="color:#555;margin:0 0 8px"><strong>Shipping to:</strong> ${addrHtml}</p>
      <p style="color:#555;margin:24px 0 8px">We'll notify you when your order ships.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">G-MART | Premium Furniture</p>
    </body></html>`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to G-MART!",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 8px">Welcome to G-MART, ${name}!</h1>
      <p style="color:#555;margin:0 0 16px">You've successfully created your account. Start exploring our curated collection of premium handcrafted furniture.</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://gmart.in"}/products" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">Browse Products</a>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">G-MART | Premium Furniture</p>
    </body></html>`,
  });
}

export async function sendContactNotification(data: { name: string; email: string; phone?: string | null; message: string }) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Contact Message from ${data.name}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h1 style="font-size:18px;margin:0 0 16px">New Contact Message</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:6px 12px;font-weight:600;color:#555">Name</td><td style="padding:6px 12px">${data.name}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#555">Email</td><td style="padding:6px 12px">${data.email}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#555">Phone</td><td style="padding:6px 12px">${data.phone || "N/A"}</td></tr>
      </table>
      <p style="color:#555;margin:0 0 8px"><strong>Message:</strong></p>
      <blockquote style="margin:0 0 24px;padding:12px 16px;background:#f9f9f9;border-left:3px solid #ccc;color:#333">${data.message}</blockquote>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">G-MART Admin</p>
    </body></html>`,
  });
}

export async function sendOrderStatusUpdate(order: {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  tracking_url?: string | null;
}) {
  const statusMessages: Record<string, string> = {
    confirmed: "Your order has been confirmed and is being processed.",
    shipped: "Your order has been shipped and is on its way!",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    cancelled: "Your order has been cancelled. If you have any questions, contact us.",
  };

  const message = statusMessages[order.status] || `Your order status has been updated to "${order.status}".`;

  let trackingHtml = "";
  if (order.status === "shipped" && order.tracking_url) {
    trackingHtml = `<a href="${order.tracking_url}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;margin-top:12px">Track Your Order</a>`;
  }

  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)} — #${order.id.slice(0, 8)}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 8px">Hi ${order.customer_name},</h1>
      <p style="color:#555;margin:0 0 16px">${message}</p>
      <p style="color:#555;margin:0 0 16px">Order <strong>#${order.id.slice(0, 8)}</strong></p>
      ${trackingHtml}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">G-MART | Premium Furniture</p>
    </body></html>`,
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset Your G-MART Password",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 8px">Reset your password</h1>
      <p style="color:#555;margin:0 0 16px">Click the button below to reset your G-MART password. This link expires in 1 hour.</p>
      <a href="${resetLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px">Reset Password</a>
      <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">G-MART | Premium Furniture</p>
    </body></html>`,
  });
}
