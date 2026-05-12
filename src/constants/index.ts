import type { SocialProvider } from '@/types/auth/auth';

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

export const ROUTESV2 = {
  HOME: '/v2',
  PRODUCTS: '/v2/products',
  PRODUCTS_CLOTHING: '/v2/products/clothing',
  PRODUCTS_DEAL: '/v2/products/deal',
  PRODUCTS_INSPIRATIONS: '/v2/products/inspirations',
  CART: '/v2/cart',
  CHECKOUT: '/v2/checkout',
  ORDERS: '/v2/orders',
  ORDER_DETAIL: (id: string) => `/v2/orders/${id}`,
  PROFILE: '/v2/profile',
  LOGIN: '/v2/login',
  SIGNUP: '/v2/signup',
  FORGOT_PASSWORD: '/v2/forgot-password',
  FORGOT_PASSWORD_SENT: '/v2/forgot-password/sent',
  ADMIN_DASHBOARD: '/v2/admin',
  ADMIN_PRODUCTS: '/v2/admin/products',
  ADMIN_PRODUCT_ADD: '/v2/admin/products/add',
  ADMIN_CATEGORY: '/v2/admin/category',
  ADMIN_ORDERS: '/v2/admin/orders',
  ADMIN_BRAND: '/v2/admin/brand',
  ADMIN_USERS: '/v2/admin/users',
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
  FORGOT_PASSWORD: '/auth/forgot-password',
  OAUTH2: (provider: SocialProvider) => `/auth/oauth2/${provider}`,
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

export const KEYCLOAK_CONFIG = {
  REALM_URL: import.meta.env.VITE_KEYCLOAK_REALM_URL || 'https://keycloak.kruzetech.dev/realms/ecommerce',
  CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecommerce-app',
  SOCIAL_PROVIDERS: {
    GOOGLE: import.meta.env.VITE_KEYCLOAK_GOOGLE_IDP_ALIAS || 'google',
    FACEBOOK: import.meta.env.VITE_KEYCLOAK_FACEBOOK_IDP_ALIAS || 'facebook',
  },
} as const;

export const SOCIAL_PROVIDER_HINTS: Record<SocialProvider, string> = {
  google: KEYCLOAK_CONFIG.SOCIAL_PROVIDERS.GOOGLE,
  facebook: KEYCLOAK_CONFIG.SOCIAL_PROVIDERS.FACEBOOK,
} as const;

export const KEYCLOAK_AUTH_ENDPOINTS = {
  AUTH: `${KEYCLOAK_CONFIG.REALM_URL}/protocol/openid-connect/auth`,
  TOKEN: `${KEYCLOAK_CONFIG.REALM_URL}/protocol/openid-connect/token`,
  USERINFO: `${KEYCLOAK_CONFIG.REALM_URL}/protocol/openid-connect/userinfo`,
  LOGOUT: `${KEYCLOAK_CONFIG.REALM_URL}/protocol/openid-connect/logout`,
  CERTS: `${KEYCLOAK_CONFIG.REALM_URL}/protocol/openid-connect/certs`,
} as const;
