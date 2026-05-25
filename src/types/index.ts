export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId?: string;
  category?: Category;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BundleItem {
  color: string;
  size: string;
  image?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
  isBundle?: boolean;
  bundleQuantity?: number;
  bundleOriginalPrice?: number;
  bundleItems?: BundleItem[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customer: Customer;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
