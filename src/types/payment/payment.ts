// ─── Payment Service (port 8085) — API contract v2 ──────────────────────────

/** Payment methods supported by Payment Service */
export type PaymentMethodType = 'COD' | 'VNPAY';

/** Status returned by Payment Service */
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// ─── Request types ──────────────────────────────────────────────────────────

/**
 * POST /api/payments/create
 * Called by Order Service internally; FE only reads the result from OrderResponse.paymentUrl.
 * Exposed here for reference / admin tools.
 */
export interface CreatePaymentRequest {
  orderId: string;        // UUID of the order
  orderNumber: string;    // e.g. "ORD-20260516-0001"
  userId: string;         // Keycloak user UUID
  amount: number;         // decimal ≥ 1000 (VND)
  paymentMethod: PaymentMethodType;
  description?: string;   // optional
}

/**
 * PUT /api/orders/{id}/payment-confirmed
 * FE calls this after VNPAY redirects back with success.
 */
export interface ConfirmPaymentRequest {
  paymentNumber?: string; // e.g. "PAY-20260516-001"
  transactionId?: string; // e.g. "VNP-123456789"
}

// ─── Response types ──────────────────────────────────────────────────────────

/**
 * Response from POST /api/payments/create and GET /api/payments/{id}
 */
export interface PaymentResponse {
  id: number;
  paymentNumber: string;  // e.g. "PAY-20260516-0001"
  orderId: string;        // UUID
  orderNumber: string;
  amount: number;
  currency: string;       // "VND"
  paymentMethod: PaymentMethodType;
  status: PaymentStatusType;
  paymentUrl: string | null; // null for COD
  createdAt: string;
}

/**
 * @deprecated Use PaymentResponse instead.
 * Kept as alias so old imports don't break during migration.
 */
export type PaymentIntent = PaymentResponse;

/**
 * @deprecated Use CreatePaymentRequest instead.
 */
export type CreatePaymentRequestLegacy = CreatePaymentRequest;

/**
 * @deprecated Use ConfirmPaymentRequest instead.
 */
export type ConfirmPaymentRequestLegacy = ConfirmPaymentRequest;
