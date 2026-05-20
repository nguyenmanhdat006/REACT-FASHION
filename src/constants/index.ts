import type { SocialProvider } from '@/types/auth/auth';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCTS_CLOTHING: '/products/clothing',
  PRODUCTS_DEAL: '/products/deal',
  PRODUCTS_INSPIRATIONS: '/products/inspirations',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT_RETURN: '/payment/return',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: '/profile',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  FORGOT_PASSWORD_SENT: '/forgot-password/sent',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_ADD: '/admin/products/add',
  ADMIN_PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
  ADMIN_CATEGORY: '/admin/category',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_BRAND: '/admin/brand',
  ADMIN_USERS: '/admin/users',
  ADMIN_MESSAGES: '/admin/messages',
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
    PROFILE: '/users/me',
    ADDRESSES: '/users/me/addresses',
    ADDRESS_DETAIL: (id: string) => `/users/me/addresses/${id}`,
    ADDRESS_DEFAULT: '/users/me/addresses/default',
    ADDRESS_SET_DEFAULT: (id: string) => `/users/me/addresses/${id}/default`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    ROLES: (id: string) => `/users/${id}/roles`,
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
  },
  CATEGORIES: {
    LIST: '/categories',
    ACTIVE: '/categories/active',
    TREE: '/categories/tree',
    DETAIL: (id: string) => `/categories/${id}`,
    SLUG: (slug: string) => `/categories/slug/${slug}`,
  },
  BRANDS: {
    LIST: '/brands',
    ACTIVE: '/brands/active',
    DETAIL: (id: string) => `/brands/${id}`,
    SLUG: (slug: string) => `/brands/slug/${slug}`,
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
    CONFIRM: (id: string) => `/orders/${id}/confirm`,
    PAYMENT_CONFIRMED: (id: string) => `/orders/${id}/payment-confirmed`,
    DELIVERED: (id: string) => `/orders/${id}/delivered`,
    CANCEL: (id: string) => `/orders/${id}/status`,
    NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    SEARCH: '/orders/search',
    SUMMARY: '/orders/summary',
  },
  PAYMENTS: {
    // All under Payment Service (port 8085, context-path /api)
    CREATE: '/payments/create',
    DETAIL: (id: string | number) => `/payments/${id}`,
    BY_ORDER_NUMBER: (orderNumber: string) => `/payments/order/${orderNumber}`,
    ORDER_SUCCESS: (orderNumber: string) => `/payments/order/${orderNumber}/success`,
    // Legacy alias
    ROOT: '/payments/create',
    BY_ORDER: (orderNumber: string) => `/payments/order/${orderNumber}`,
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
  CHAT: {
    CONVERSATIONS_LIST: '/chat/conversations',
    /** Customer: create or get single support thread */
    SUPPORT_CONVERSATION: '/chat/conversations/support',
    /** Admin: unclaimed support queue */
    SUPPORT_QUEUE: '/chat/conversations/support/queue',
    CLAIM_CONVERSATION: (conversationId: number) => `/chat/conversations/${conversationId}/claim`,
    CONVERSATION_DETAIL: (conversationId: number) => `/chat/conversations/${conversationId}`,
    CONVERSATION_MESSAGES: (conversationId: number) =>
      `/chat/conversations/${conversationId}/messages`,
    SEND_MESSAGE: '/chat/messages',
  },
  SHIPPING: {
    // All under Shipping Service (port 8088)
    CALCULATE_FEE: '/shipping/calculate-fee',
    CREATE: '/shipping/create',
    DETAIL: (id: string | number) => `/shipping/${id}`,
    UPDATE_STATUS: (id: string | number) => `/shipping/${id}/status`,
    DELIVER: (id: string | number) => `/shipping/${id}/deliver`,
    // Legacy
    BY_ORDER: (orderId: string) => `/shipping/order/${orderId}`,
    TRACK: (trackingNumber: string) => `/shipping/track/${trackingNumber}`,
  },
} as const;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:9093';

export const STORAGE_BASE_URL =
  (import.meta.env.VITE_STORAGE_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:8087';

export const STORAGE_ENDPOINTS = {
  UPLOAD: '/uploads',
} as const;

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
