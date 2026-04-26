import type { PageResponse } from '@/types/common/common';
import type { CreateOrderRequest, Order } from '@/types/order/order';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order/order';
import { MOCK_PRODUCTS } from '@/mocks/ecommerce/ecommerceMockData';

export const MOCK_ORDERS_DATA: Order[] = [
  {
    id: 'o-1',
    orderNumber: 'ORD-20260302-0001',
    userId: 'user-1',
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    items: [
      {
        id: 'oi-1',
        productId: 'p-2',
        productName: 'Men Minimal Hoodie',
        productImageUrl: MOCK_PRODUCTS[1].images[0].imageUrl,
        quantity: 1,
        price: 35,
        subtotal: 35,
      },
      {
        id: 'oi-2',
        productId: 'p-4',
        productName: 'Canvas Tote Bag',
        productImageUrl: MOCK_PRODUCTS[3].images[0].imageUrl,
        quantity: 2,
        price: 22,
        subtotal: 44,
      },
    ],
    subtotal: 79,
    discount: 5,
    shipping: 3,
    tax: 2,
    total: 79,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Nguyen Dat',
      phone: '0901234567',
      addressLine1: '123 Le Loi',
      city: 'Ho Chi Minh City',
      state: 'District 1',
      zipCode: '700000',
      country: 'Vietnam',
      isDefault: true,
    },
    customerName: 'Nguyen Dat',
    customerEmail: 'dat@example.com',
    customerPhone: '0901234567',
    orderedAt: '2026-03-01T09:00:00Z',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'o-2',
    orderNumber: 'ORD-20260302-0002',
    userId: 'user-1',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
    items: [
      {
        id: 'oi-3',
        productId: 'p-5',
        productName: 'Slim Fit Jeans',
        productImageUrl: MOCK_PRODUCTS[4].images[0].imageUrl,
        quantity: 1,
        price: 44,
        subtotal: 44,
      },
    ],
    subtotal: 44,
    discount: 0,
    shipping: 3,
    tax: 1,
    total: 48,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Nguyen Dat',
      phone: '0901234567',
      addressLine1: '123 Le Loi',
      city: 'Ho Chi Minh City',
      state: 'District 1',
      zipCode: '700000',
      country: 'Vietnam',
      isDefault: true,
    },
    customerName: 'Nguyen Dat',
    customerEmail: 'dat@example.com',
    customerPhone: '0901234567',
    orderedAt: '2026-02-25T08:00:00Z',
    createdAt: '2026-02-25T08:00:00Z',
  },
];

export const MOCK_ORDERS_PAGE: PageResponse<Order> = {
  content: MOCK_ORDERS_DATA,
  page: 0,
  size: 10,
  totalElements: MOCK_ORDERS_DATA.length,
  totalPages: 1,
  isLast: true,
};

export const MOCK_CREATE_ORDER_REQUEST: CreateOrderRequest = {
  paymentMethod: PaymentMethod.CREDIT_CARD,
  shippingAddress: {
    fullName: 'Nguyen Dat',
    phone: '0901234567',
    addressLine1: '123 Le Loi',
    city: 'Ho Chi Minh City',
    state: 'District 1',
    zipCode: '700000',
    country: 'Vietnam',
  },
  notes: 'Please call before delivery.',
};
