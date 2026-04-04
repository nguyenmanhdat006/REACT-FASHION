export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'CUSTOMER',
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/users/me',
} as const;

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: {
    PROFILE: '/users/profile',
    ADDRESSES: '/addresses',
    ADDRESS_DETAIL: (id: string) => `/addresses/${id}`,
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SLUG: (slug: string) => `/products/slug/${slug}`,
    PUBLISHED: '/products/published',
    FEATURED: '/products/featured',
    BY_CATEGORY: (categoryId: string) => `/products/category/${categoryId}`,
    BY_BRAND: (brandId: string) => `/products/brand/${brandId}`,
    PRICE_RANGE: '/products/price-range',
    SEARCH: '/products/search',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    UPLOAD_IMAGE: (id: string) => `/products/${id}/images/upload`,
    SYNC_ELASTICSEARCH: '/products/sync-elasticsearch',
    CATEGORIES: '/categories',
    CATEGORIES_TREE: '/categories/tree',
    CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
    CATEGORY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    BRANDS: '/brands',
    BRANDS_ACTIVE: '/brands/active',
    BRAND_DETAIL: (id: string) => `/brands/${id}`,
    BRAND_SLUG: (slug: string) => `/brands/slug/${slug}`,
  },
  CART: {
    ROOT: '/cart',
    ITEMS: '/cart/items',
    ITEM_DETAIL: (itemId: string) => `/cart/items/${itemId}`,
    SUMMARY: '/cart/summary',
  },
  ORDERS: {
    ROOT: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    SEARCH: '/orders/search',
    SUMMARY: '/orders/summary',
  },
  PAYMENTS: {
    ROOT: '/payments',
    DETAIL: (id: string) => `/payments/${id}`,
    CONFIRM: (id: string) => `/payments/${id}/confirm`,
    BY_ORDER: (orderId: string) => `/payments/order/${orderId}`,
  },
  REVIEWS: {
    ROOT: '/reviews',
    PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    SUMMARY: (productId: string) => `/reviews/product/${productId}/summary`,
    VOTE: (id: string) => `/reviews/${id}/vote`,
    MY_REVIEWS: '/reviews/user/me',
  },
  NOTIFICATIONS: {
    MY: '/notifications/user/me',
    MARK_READ: (id: string) => `/notifications/${id}/mark-read`,
  },
  SHIPPING: {
    CALCULATE_FEE: '/shipping/calculate-fee',
    BY_ORDER: (orderId: string) => `/shipping/order/${orderId}`,
    TRACK: (trackingNumber: string) => `/shipping/track/${trackingNumber}`,
  },
} as const;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
