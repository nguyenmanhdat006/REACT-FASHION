import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common';
import type {
  CreateReviewRequest,
  Review,
  ReviewPage,
  ReviewSummary,
} from '@/types/review';
import apiClient from '@/utils/api';

export const reviewService = {
  createReview: async (payload: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEWS.ROOT,
      payload
    );
    return response.data;
  },

  getProductReviews: async (
    productId: string,
    params?: { page?: number; size?: number; sort?: 'helpful' | 'newest' | 'rating' }
  ): Promise<ReviewPage> => {
    const response = await apiClient.get<ApiResponse<ReviewPage>>(
      API_ENDPOINTS.REVIEWS.PRODUCT(productId),
      { params }
    );
    return response.data;
  },

  getProductReviewSummary: async (productId: string): Promise<ReviewSummary> => {
    const response = await apiClient.get<ApiResponse<ReviewSummary>>(
      API_ENDPOINTS.REVIEWS.SUMMARY(productId)
    );
    return response.data;
  },

  voteReview: async (reviewId: string, helpful: boolean): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.REVIEWS.VOTE(reviewId), { helpful });
  },
};
