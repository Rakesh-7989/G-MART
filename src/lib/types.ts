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
  created_at?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
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

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "cod" | "cashfree";
  payment_status: "pending" | "paid" | "failed";
  shipping_address: Address;
  created_at: string;
}
