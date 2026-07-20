import { z } from "zod";
import { NextResponse } from "next/server";

export function validate<T>(schema: z.ZodType<T>, data: unknown): { data: T } | { error: NextResponse } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { error: NextResponse.json({ error: result.error.issues[0]?.message || "Invalid input" }, { status: 400 }) };
  }
  return { data: result.data };
}

export const authSigninSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authSignupSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const authForgotPasswordSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const authResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().positive("Price must be positive"),
  compare_at_price: z.number().int().positive().optional().nullable(),
  images: z.array(z.string()).default([]),
  category_id: z.string().uuid("Valid category ID required"),
  material: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock_quantity: z.number().int().min(0).default(0),
  in_stock: z.boolean().default(true),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  review_count: z.number().int().min(0).default(0),
});

export const productUpdateSchema = productSchema.partial();

export const addressSchema = z.object({
  label: z.string().default("Home"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(4, "Valid pincode required"),
  is_default: z.boolean().default(false),
});

export const addressUpdateSchema = z.object({
  id: z.string().uuid("Valid address ID required"),
  label: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional().nullable(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  is_default: z.boolean().optional(),
});

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid("Valid product ID required"),
    productName: z.string().optional(),
    name: z.string().min(1, "Product name required"),
    price: z.number().positive("Price must be positive"),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  })).min(1, "Cart is empty"),
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(4, "Valid pincode required"),
  }),
  paymentMethod: z.enum(["cod", "cashfree"]).default("cod"),
  total: z.number().positive("Total must be positive"),
  couponCode: z.string().optional().nullable(),
  discount: z.number().int().min(0).default(0),
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const wishlistSchema = z.object({
  productId: z.string().uuid("Valid product ID required"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export const reviewSchema = z.object({
  product_id: z.string().uuid("Valid product ID required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().optional().nullable(),
  body: z.string().min(1, "Review body is required"),
});
