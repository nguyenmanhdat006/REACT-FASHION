import type { PaymentResponse, CreatePaymentRequest } from '@/types/payment/payment';

export const MOCK_PAYMENT_RESPONSE: PaymentResponse = {
  id: 1,
  paymentNumber: 'PAY-20260516-0001',
  orderId: '550e8400-e29b-41d4-a716-446655440000',
  orderNumber: 'ORD-20260516-0001',
  amount: 27530000,
  currency: 'VND',
  paymentMethod: 'VNPAY',
  status: 'PENDING',
  paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=1',
  createdAt: '2026-05-16T09:00:00',
};

export const MOCK_PAYMENT_COD: PaymentResponse = {
  ...MOCK_PAYMENT_RESPONSE,
  id: 2,
  paymentNumber: 'PAY-20260516-0002',
  orderNumber: 'ORD-20260516-0002',
  paymentMethod: 'COD',
  paymentUrl: null,
  status: 'PENDING',
};

export const MOCK_CREATE_PAYMENT_REQUEST: CreatePaymentRequest = {
  orderId: '550e8400-e29b-41d4-a716-446655440000',
  orderNumber: 'ORD-20260516-0001',
  userId: 'user-keycloak-uuid',
  amount: 27530000,
  paymentMethod: 'VNPAY',
  description: 'Thanh toán đơn hàng ORD-20260516-0001',
};

export const MOCK_CONFIRMED_PAYMENT: PaymentResponse = {
  ...MOCK_PAYMENT_RESPONSE,
  status: 'PAID',
  paymentUrl: null,
};

// ─── Legacy aliases for mock handler compatibility ────────────────────────────
/** @deprecated Use MOCK_PAYMENT_RESPONSE */
export const MOCK_PAYMENT_INTENT = MOCK_PAYMENT_RESPONSE;
/** @deprecated Use MOCK_CONFIRMED_PAYMENT */
export const MOCK_CONFIRMED_PAYMENT_INTENT = MOCK_CONFIRMED_PAYMENT;
/** @deprecated */
export const MOCK_CREATE_PAYMENT_REQUEST_LEGACY = MOCK_CREATE_PAYMENT_REQUEST;
/** @deprecated */
export const MOCK_CONFIRM_PAYMENT_REQUEST = { paymentNumber: 'PAY-20260516-0001' };
