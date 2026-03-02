import { API_ENDPOINTS } from '@/constants';
import type {
  AddToCartRequest,
  Cart,
  CartSummary,
  UpdateCartItemRequest,
} from '@/types/cart';
import type { ApiResponse } from '@/types/common';
import apiClient from '@/utils/api';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>(API_ENDPOINTS.CART.ROOT);
    return response.data;
  },

  addToCart: async (payload: AddToCartRequest): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      API_ENDPOINTS.CART.ITEMS,
      payload
    );
    return response.data;
  },

  updateQuantity: async (itemId: string, payload: UpdateCartItemRequest): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      API_ENDPOINTS.CART.ITEM_DETAIL(itemId),
      payload
    );
    return response.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      API_ENDPOINTS.CART.ITEM_DETAIL(itemId)
    );
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART.ROOT);
  },

  getSummary: async (): Promise<CartSummary> => {
    const response = await apiClient.get<ApiResponse<CartSummary>>(
      API_ENDPOINTS.CART.SUMMARY
    );
    return response.data;
  },
};
