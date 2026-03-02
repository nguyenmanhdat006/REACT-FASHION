import type { Address } from './auth';
import type { PageResponse } from './common';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  VNPAY = 'VNPAY',
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderedAt: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  paymentMethod: PaymentMethod;
  shippingAddress: Omit<Address, 'id' | 'isDefault'>;
  billingAddress?: Omit<Address, 'id' | 'isDefault'>;
  notes?: string;
}

export type OrderPage = PageResponse<Order>;
