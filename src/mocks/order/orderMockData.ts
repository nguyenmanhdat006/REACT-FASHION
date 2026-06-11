import type { ApiResponse, PageMeta } from '@/types/common/common';
import type { CreateOrderRequest, Order } from '@/types/order/order';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order/order';
import { buildSeedOrders } from '@/mocks/storage/mockState';
import { findMockProductImageUrl } from '@/mocks/product/productSeedData';

export const MOCK_ORDERS_DATA: Order[] = buildSeedOrders();

export const MOCK_ORDERS_PAGE: ApiResponse<Order[], PageMeta> = {
  success: true,
  data: MOCK_ORDERS_DATA,
  meta: {
    page: 0,
    size: 10,
    totalElements: MOCK_ORDERS_DATA.length,
    totalPages: 1,
    first: true,
    last: true,
  },
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
};

export const MOCK_CREATE_ORDER_REQUEST: CreateOrderRequest = {
  items: [
    {
      productId: 'p-11',
      productName: 'Minimalist Black Coach Jacket',
      productImageUrl: findMockProductImageUrl('p-11'),
      quantity: 1,
      price: 62,
    },
  ],
  paymentMethod: 'COD',
  shippingAddress: {
    recipientName: 'Nguyen Dat',
    phone: '0901234567',
    address: '123 Nguyen Hue Street, Q1',
    city: 'Ho Chi Minh',
    province: 'Ho Chi Minh',
    zipCode: '700000',
  },
  note: 'Giao sau 5h chieu',
};

export { OrderStatus, PaymentMethod, PaymentStatus };
