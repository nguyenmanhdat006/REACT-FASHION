import type { PageResponse } from './common';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
}

export type ReviewPage = PageResponse<Review>;
