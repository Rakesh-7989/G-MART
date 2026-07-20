export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  category: { name: string; slug: string };
  category_id: string;
  material?: string | null;
  dimensions?: string | null;
  color?: string | null;
  in_stock: boolean;
  featured?: boolean;
  rating: number;
  review_count: number;
  sku?: string | null;
  created_at?: string;
  variants?: ProductVariant[];
  product_variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  color_hex?: string | null | undefined;
  sku?: string | null | undefined;
  price?: number | null | undefined;
  compare_at_price?: number | null | undefined;
  stock_quantity: number;
  image?: string | null | undefined;
  is_default: boolean;
  sort_order: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentData {
  emi_tenure?: number;
  emi_amount?: number;
  emi_bank_name?: string;
  emi_monthly_amount?: number;
  payment_method?: string;
  payment_group?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "cod" | "cashfree" | "emi";
  payment_status: "pending" | "paid" | "failed";
  payment_data?: PaymentData | null;
  shipping_address: Address;
  created_at: string;
}
