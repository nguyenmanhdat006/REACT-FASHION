import type {
  ConfirmPaymentRequest,
  CreatePaymentRequest,
  PaymentIntent,
} from '@/types/payment/payment';

export const MOCK_PAYMENT_INTENT: PaymentIntent = {
  paymentId: 'pay-1',
  clientSecret: 'pi_mock_secret_123',
  amount: 790000,
  status: 'PENDING',
};

export const MOCK_CREATE_PAYMENT_REQUEST: CreatePaymentRequest = {
  orderId: 'o-1',
  amount: 790000,
  currency: 'VND',
  paymentMethod: 'VNPAY',
};

export const MOCK_CONFIRM_PAYMENT_REQUEST: ConfirmPaymentRequest = {
  paymentIntentId: 'pi_mock_123',
};

export const MOCK_CONFIRMED_PAYMENT_INTENT: PaymentIntent = {
  ...MOCK_PAYMENT_INTENT,
  status: 'PAID',
};
