import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import type {
  CreateReviewRequest,
  Review,
  ReviewSummary,
} from '@/types/review/review';
import apiClient from '@/utils/api';

export const reviewService = {
  createReview: (payload: CreateReviewRequest): Promise<ApiResponse<Review>> =>
    apiClient.post<ApiResponse<Review>>(API_ENDPOINTS.REVIEWS.ROOT, payload),

  getProductReviews: (
    productId: string,
    params?: { page?: number; size?: number; sort?: 'helpful' | 'newest' | 'rating' }
  ): Promise<ApiResponse<Review[], PageMeta>> =>
    apiClient.get<ApiResponse<Review[], PageMeta>>(API_ENDPOINTS.REVIEWS.PRODUCT(productId), {
      params,
    }),

  getProductReviewSummary: (productId: string): Promise<ApiResponse<ReviewSummary>> =>
    apiClient.get<ApiResponse<ReviewSummary>>(API_ENDPOINTS.REVIEWS.SUMMARY(productId)),

  voteReview: (reviewId: string, helpful: boolean): Promise<void> =>
    apiClient.post(API_ENDPOINTS.REVIEWS.VOTE(reviewId), { helpful }),
};
