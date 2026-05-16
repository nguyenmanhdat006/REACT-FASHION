/**
 * Checkout form schema & mapper — aligned with API contract.
 *
 * CreateOrderRequest contract (Order Service POST /api/orders):
 *   items[]              — comes from cart (fetched server-side); also accepted inline
 *   paymentMethod        — "COD" | "VNPAY"
 *   shippingAddress      — { recipientName, phone, address, city, province, zipCode }
 *   note?
 */
import { z } from 'zod';
import { VIETNAMESE_PHONE_REGEX } from '@/utils/phone';
import type { CreateOrderRequest, CreateOrderItemRequest } from '@/types/order/order';

// ─── Schema ──────────────────────────────────────────────────────────────────

export const shippingInfoSchema = z.object({
  recipientName: z.string().trim().min(1, 'Tên người nhận là bắt buộc'),
  phone: z
    .string()
    .trim()
    .refine(v => VIETNAMESE_PHONE_REGEX.test(v), {
      message: 'Số điện thoại không hợp lệ (định dạng VN: 0xx hoặc +84xx)',
    }),
  address: z.string().trim().min(1, 'Địa chỉ là bắt buộc'),
  city: z.string().trim().min(1, 'Thành phố là bắt buộc'),
  province: z.string().trim().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  zipCode: z.string().trim().min(1, 'Mã bưu điện là bắt buộc'),
  paymentMethod: z.enum(['COD', 'VNPAY']),
  note: z.string().trim().optional(),
});

export type ShippingInfoFormValues = z.infer<typeof shippingInfoSchema>;

// ─── Default values ──────────────────────────────────────────────────────────

export const emptyShippingInfo = (): ShippingInfoFormValues => ({
  recipientName: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  zipCode: '',
  paymentMethod: 'COD',
  note: '',
});

// ─── Mapper ──────────────────────────────────────────────────────────────────

const toOptionalString = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

/**
 * Convert form values + cart items to CreateOrderRequest.
 * `cartItems` should be the user's current cart items.
 */
export const toCreateOrderRequest = (
  values: ShippingInfoFormValues,
  cartItems: CreateOrderItemRequest[] = []
): CreateOrderRequest => ({
  items: cartItems,
  paymentMethod: values.paymentMethod,
  shippingAddress: {
    recipientName: values.recipientName.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    city: values.city.trim(),
    province: values.province.trim(),
    zipCode: values.zipCode.trim(),
  },
  note: toOptionalString(values.note),
});

/** @deprecated Use toCreateOrderRequest */
export const toCheckoutPayload = toCreateOrderRequest;
