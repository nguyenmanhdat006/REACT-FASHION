export const IMAGES = {
  DISCOUNT_BANNER: '/images/2164f1ee2b6a236aea160f5c3012a58b.jpg',
  DISCOUNT_BANNER_2: '/images/7f6970e1a95a78da126656230ec7954b.jpg',
  OFFER_BANNER: '/images/afc25bfa093895ca09c47c858607a986.jpg',
  RIGHT_BRAND_BANNER: '/images/c5d88f08c02e003fc4a817c89242dc48.jpg',
  PROMO_TILE: '/images/18fce6a693f14f209e4c5b8718c7b8b3.jpg',
  PRODUCT_DEMO_1: '/images/d0b7f63402d272d23a5d55e60f8ca436.jpg',
  PRODUCT_DEMO_2: '/images/a29fe122ff6ca3f26d2ae76f5aaf52b4.jpg',
  USER_AVATAR: '/images/ab6761610000e5eb5f8ecdf749f805691a999711.jpeg',
} as const;

/** Home promos, sidebar tiles, avatars — not used as product catalog photos. */
export const RESERVED_IMAGE_FILES = [
  '2164f1ee2b6a236aea160f5c3012a58b.jpg',
  '7f6970e1a95a78da126656230ec7954b.jpg',
  'afc25bfa093895ca09c47c858607a986.jpg',
  'c5d88f08c02e003fc4a817c89242dc48.jpg',
  '18fce6a693f14f209e4c5b8718c7b8b3.jpg',
  'd0b7f63402d272d23a5d55e60f8ca436.jpg',
  'a29fe122ff6ca3f26d2ae76f5aaf52b4.jpg',
  'ab6761610000e5eb5f8ecdf749f805691a999711.jpeg',
] as const;

export type ReservedImageFile = (typeof RESERVED_IMAGE_FILES)[number];
