import type { ApiResponse, PageMeta } from '@/types/common/common';
import type { CreateOrderRequest, Order } from '@/types/order/order';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order/order';

export const MOCK_ORDERS_DATA: Order[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    orderNumber: 'ORD-20260516-0001',
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.VNPAY,
    paymentUrl: null,
    shipmentId: 1,
    items: [
      {
        id: 'oi-1',
        productId: 'PROD-001',
        productName: 'Men Minimal Hoodie',
        quantity: 1,
        price: 350000,
        subtotal: 350000,
      },
      {
        id: 'oi-2',
        productId: 'PROD-002',
        productName: 'Canvas Tote Bag',
        quantity: 2,
        price: 220000,
        subtotal: 440000,
      },
    ],
    subtotal: 790000,
    discount: 0,
    shipping: 30000,
    tax: 79000,
    total: 899000,
    shippingAddress: {
      recipientName: 'Nguyen Dat',
      phone: '0901234567',
      address: '123 Le Loi, Q1',
      city: 'Ho Chi Minh',
      province: 'Ho Chi Minh',
      zipCode: '700000',
    },
    createdAt: '2026-05-16T09:00:00',
    // legacy fields
    userId: 'user-1',
    customerName: 'Nguyen Dat',
    customerEmail: 'dat@example.com',
    customerPhone: '0901234567',
    orderedAt: '2026-05-16T09:00:00',
    updatedAt: '2026-05-16T09:00:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    orderNumber: 'ORD-20260302-0002',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.COD,
    paymentUrl: null,
    shipmentId: 2,
    items: [
      {
        id: 'oi-3',
        productId: 'PROD-005',
        productName: 'Slim Fit Jeans',
        quantity: 1,
        price: 440000,
        subtotal: 440000,
      },
    ],
    subtotal: 440000,
    discount: 0,
    shipping: 30000,
    tax: 44000,
    total: 514000,
    shippingAddress: {
      recipientName: 'Nguyen Dat',
      phone: '0901234567',
      address: '456 Nguyen Hue, Q1',
      city: 'Ho Chi Minh',
      province: 'Ho Chi Minh',
      zipCode: '700000',
    },
    createdAt: '2026-02-25T08:00:00',
    // legacy fields
    userId: 'user-1',
    customerName: 'Nguyen Dat',
    customerEmail: 'dat@example.com',
    customerPhone: '0901234567',
    orderedAt: '2026-02-25T08:00:00',
    updatedAt: '2026-02-25T08:00:00',
  },
];

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
      productId: 'PROD-001',
      productName: 'Men Minimal Hoodie',
      quantity: 1,
      price: 350000,
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
  note: 'Giao sau 5h chiều',
};
