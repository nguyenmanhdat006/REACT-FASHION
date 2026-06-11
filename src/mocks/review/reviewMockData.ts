import type { ApiResponse, PageMeta } from '@/types/common/common';
import type { CreateReviewRequest, Review, ReviewSummary } from '@/types/review/review';
import { buildSeedReviews } from '@/mocks/storage/mockState';

export const MOCK_REVIEWS: Review[] = buildSeedReviews();

export const MOCK_REVIEW_PAGE: ApiResponse<Review[], PageMeta> = {
  success: true,
  data: MOCK_REVIEWS,
  meta: {
    page: 0,
    size: 10,
    totalElements: MOCK_REVIEWS.length,
    totalPages: MOCK_REVIEWS.length === 0 ? 0 : 1,
    first: true,
    last: true,
  },
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
};

export const MOCK_REVIEW_SUMMARY: ReviewSummary = {
  averageRating: 4.7,
  totalReviews: MOCK_REVIEWS.length,
  distribution: {
    '5': 2,
    '4': 1,
    '3': 0,
    '2': 0,
    '1': 0,
  },
};

export const MOCK_CREATE_REVIEW_REQUEST: CreateReviewRequest = {
  productId: 'p-11',
  orderId: 'o-1',
  rating: 5,
  title: 'Worth the price',
  comment: 'Delivery was fast and the product is exactly as expected.',
};
