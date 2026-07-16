export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  material?: string;
  dimensions?: string;
  color?: string;
  inStock: boolean;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
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
  customerId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "cashfree";
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: Address;
  createdAt: string;
}
