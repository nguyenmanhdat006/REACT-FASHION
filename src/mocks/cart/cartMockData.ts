import type {
  AddToCartRequest,
  Cart,
  CartSummary,
  UpdateCartItemRequest,
} from '@/types/cart/cart';
import { buildSeedCart } from '@/mocks/storage/mockState';

export const MOCK_CART_DATA: Cart = buildSeedCart();

export const MOCK_CART_SUMMARY: CartSummary = {
  totalItems: MOCK_CART_DATA.totalItems,
  subtotal: MOCK_CART_DATA.subtotal,
  discount: MOCK_CART_DATA.discount,
  total: MOCK_CART_DATA.total,
};

export const MOCK_ADD_TO_CART_REQUEST: AddToCartRequest = {
  productId: 'p-13',
  quantity: 1,
};

export const MOCK_UPDATE_CART_ITEM_REQUEST: UpdateCartItemRequest = {
  quantity: 3,
};
