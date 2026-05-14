import { API_ENDPOINTS } from '@/constants';
import type {
  AddToCartRequest,
  Cart,
  CartSummary,
  UpdateCartItemRequest,
} from '@/types/cart/cart';
import type { ApiResponse } from '@/types/common/common';
import apiClient from '@/utils/api';

export const cartService = {
  getCart: (): Promise<ApiResponse<Cart>> =>
    apiClient.get<ApiResponse<Cart>>(API_ENDPOINTS.CART.ROOT),

  addToCart: (payload: AddToCartRequest): Promise<ApiResponse<Cart>> =>
    apiClient.post<ApiResponse<Cart>>(API_ENDPOINTS.CART.ITEMS, payload),

  updateQuantity: (
    itemId: string,
    payload: UpdateCartItemRequest
  ): Promise<ApiResponse<Cart>> =>
    apiClient.put<ApiResponse<Cart>>(API_ENDPOINTS.CART.ITEM_DETAIL(itemId), payload),

  removeItem: (itemId: string): Promise<ApiResponse<Cart>> =>
    apiClient.delete<ApiResponse<Cart>>(API_ENDPOINTS.CART.ITEM_DETAIL(itemId)),

  clearCart: (): Promise<void> => apiClient.delete(API_ENDPOINTS.CART.ROOT),

  getSummary: (): Promise<ApiResponse<CartSummary>> =>
    apiClient.get<ApiResponse<CartSummary>>(API_ENDPOINTS.CART.SUMMARY),
};
