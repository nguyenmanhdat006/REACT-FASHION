import type {
  AddToCartRequest,
  Cart,
  CartSummary,
  UpdateCartItemRequest,
} from '@/types/cart/cart';
import { CartStatus } from '@/types/cart/cart';
import { MOCK_PRODUCTS } from '@/mocks/ecommerce/ecommerceMockData';

export const MOCK_CART_DATA: Cart = {
  id: 'cart-1',
  userId: 'user-1',
  status: CartStatus.ACTIVE,
  items: [
    {
      id: 'ci-1',
      productId: 'p-1',
      productName: 'Women Oversized Blazer',
      productImageUrl: MOCK_PRODUCTS[0].images?.[0]?.imageUrl ?? '',
      quantity: 1,
      price: 59,
      total: 59,
      inStock: true,
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'ci-2',
      productId: 'p-3',
      productName: 'Chunky White Sneakers',
      productImageUrl: MOCK_PRODUCTS[2].images?.[0]?.imageUrl ?? '',
      quantity: 2,
      price: 65,
      total: 130,
      inStock: true,
      createdAt: '2026-03-01T10:10:00Z',
    },
  ],
  totalItems: 3,
  subtotal: 189,
  discount: 20,
  total: 169,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:10:00Z',
};

export const MOCK_CART_SUMMARY: CartSummary = {
  totalItems: MOCK_CART_DATA.totalItems,
  subtotal: MOCK_CART_DATA.subtotal,
  discount: MOCK_CART_DATA.discount,
  total: MOCK_CART_DATA.total,
};

export const MOCK_ADD_TO_CART_REQUEST: AddToCartRequest = {
  productId: 'p-2',
  quantity: 1,
};

export const MOCK_UPDATE_CART_ITEM_REQUEST: UpdateCartItemRequest = {
  quantity: 3,
};
