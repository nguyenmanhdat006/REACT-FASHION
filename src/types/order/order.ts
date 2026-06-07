import type { ApiResponse, PageMeta } from '../common/common';

// ─── Enums ───────────────────────────────────────────────────────────────────

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

/**
 * Payment methods as accepted by Order Service.
 * "COD" is the canonical value; "CASH_ON_DELIVERY" may appear in responses.
 */
export enum PaymentMethod {
  COD = 'COD',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  VNPAY = 'VNPAY',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED_DELIVERY = 'FAILED_DELIVERY',
  CANCELLED = 'CANCELLED',
}

// ─── Shared sub-types ─────────────────────────────────────────────────────────

/**
 * Shipping address as returned inside OrderResponse.
 * Matches the contract's shippingAddress object.
 */
export interface OrderShippingAddress {
  recipientName: string;
  phone: string;
  address: string;    // street address
  city: string;
  province: string;
  zipCode: string;
}

/**
 * @deprecated Old field-name convention kept for mock/legacy code.
 * New code must use OrderShippingAddress.
 */
export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  wardCode?: string;
  districtId?: number;
  zipCode?: string;
  country?: string;
  addressType?: 'SHIPPING' | 'BILLING' | 'BOTH';
}

// ─── Order Item ───────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  /** Optional — may be present in local/mock data */
  productImageUrl?: string;
}

// ─── Order (Response) ─────────────────────────────────────────────────────────

/**
 * Full order as returned by GET /api/orders/{id} (Order Service port 8084).
 */
export interface Order {
  id: string;                         // UUID
  orderNumber: string;                // e.g. "ORD-20260516-0001"
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentUrl: string | null;          // redirect URL for VNPAY; null for COD
  shipmentId: number | null;
  shipmentStatus?: ShipmentStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;                   // fee from Shipping Service
  tax: number;                        // 10% of subtotal
  total: number;
  shippingAddress: OrderShippingAddress;
  createdAt: string;
  // ── legacy / optional fields kept for backwards-compat ──
  userId?: string;
  paymentId?: string;
  billingAddress?: OrderAddress;
  trackingNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  orderedAt?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  updatedAt?: string;
}

// ─── Create Order Request ─────────────────────────────────────────────────────

/**
 * POST /api/orders — Tạo đơn hàng mới
 * The FE sends this payload; items come from the cart on the server side
 * OR are passed directly here. The contract accepts items[] in the body.
 */
export interface CreateOrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;       // ≥ 1
  price: number;          // VND
  productImageUrl?: string;
}

export interface CreateOrderShippingAddress {
  recipientName: string;
  phone: string;
  address: string;        // street address
  city: string;
  province: string;
  zipCode: string;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  paymentMethod: 'COD' | 'VNPAY';
  shippingAddress: CreateOrderShippingAddress;
  note?: string;          // optional
}

// ─── Cancel Order Request ─────────────────────────────────────────────────────

export interface CancelOrderRequest {
  status: 'CANCELLED';
  notes?: string;
}

// ─── Admin list filters (GET /api/orders) ─────────────────────────────────────

export interface OrderFilters {
  page?: number;
  size?: number;
  keyword?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ─── Paginated response helpers ───────────────────────────────────────────────

export type OrderPage = ApiResponse<Order[], PageMeta>;
