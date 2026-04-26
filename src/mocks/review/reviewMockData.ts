import type { Review, ReviewPage, ReviewSummary } from '@/types/review/review';
import type { CreateReviewRequest } from '@/types/review/review';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Le Thanh',
    rating: 5,
    title: 'Great quality',
    comment: 'Fabric is good and size is true to chart.',
    verified: true,
    helpfulCount: 12,
    createdAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'rev-2',
    userName: 'Tran Minh',
    rating: 4,
    title: 'Nice but a bit tight',
    comment: 'Overall very good, maybe go one size up.',
    verified: true,
    helpfulCount: 5,
    createdAt: '2026-03-11T09:00:00Z',
  },
];

export const MOCK_REVIEW_PAGE: ReviewPage = {
  content: MOCK_REVIEWS,
  page: 0,
  size: 10,
  totalElements: MOCK_REVIEWS.length,
  totalPages: 1,
  isLast: true,
};

export const MOCK_REVIEW_SUMMARY: ReviewSummary = {
  averageRating: 4.5,
  totalReviews: 2,
  distribution: {
    '5': 1,
    '4': 1,
    '3': 0,
    '2': 0,
    '1': 0,
  },
};

export const MOCK_CREATE_REVIEW_REQUEST: CreateReviewRequest = {
  productId: 'p-1',
  orderId: 'o-1',
  rating: 5,
  title: 'Worth the price',
  comment: 'Delivery was fast and the product is exactly as expected.',
};
