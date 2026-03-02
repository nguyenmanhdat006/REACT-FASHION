export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'VNPAY' | 'PAYPAL';
}

export interface PaymentIntent {
  paymentId: string;
  clientSecret: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}
