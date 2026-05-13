import { API_ENDPOINTS, AUTH_ENDPOINTS } from '@/constants';
import { MOCK_ADDRESSES, MOCK_USER_PROFILE } from '@/mocks/user/userMockData';
import {
  MOCK_AUTH_RESPONSE,
  MOCK_AUTH_USER,
  MOCK_USER_ADDRESSES,
} from '@/mocks/auth/authMockData';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS_DATA,
} from '@/mocks/product/productMockData';
import {
  MOCK_ADD_TO_CART_REQUEST,
  MOCK_CART_DATA,
  MOCK_CART_SUMMARY,
  MOCK_UPDATE_CART_ITEM_REQUEST,
} from '@/mocks/cart/cartMockData';
import {
  MOCK_ORDERS_DATA,
} from '@/mocks/order/orderMockData';
import {
  MOCK_CONFIRMED_PAYMENT_INTENT,
  MOCK_CREATE_PAYMENT_REQUEST,
  MOCK_PAYMENT_INTENT,
} from '@/mocks/payment/paymentMockData';
import {
  MOCK_CREATE_REVIEW_REQUEST,
  MOCK_REVIEW_SUMMARY,
  MOCK_REVIEWS,
} from '@/mocks/review/reviewMockData';
import {
  MOCK_SHIPMENT,
  MOCK_SHIPPING_FEE_REQUEST,
  MOCK_SHIPPING_FEE_RESPONSE,
} from '@/mocks/shipping/shippingMockData';
import {
  MOCK_NOTIFICATIONS,
} from '@/mocks/notification/notificationMockData';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import { PaymentMethod, PaymentStatus, type Order, OrderStatus } from '@/types/order/order';
import type { PaymentIntent } from '@/types/payment/payment';
import type { Product } from '@/types/product/product';
import type { AxiosRequestConfig } from 'axios';

export type MockHttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const toResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
});

type PagedListBody<T> = { data: T[]; meta: PageMeta };

const toPage = <T>(items: T[], page = 0, size = 20): PagedListBody<T> => {
  const safeSize = size > 0 ? size : 20;
  const totalElements = items.length;
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / safeSize);
  const start = page * safeSize;
  const end = Math.min(start + safeSize, totalElements);
  const data = items.slice(start, end);
  const first = page === 0;
  const last = totalPages === 0 ? true : page >= totalPages - 1;

  return {
    data,
    meta: {
      page,
      size: safeSize,
      totalElements,
      totalPages,
      first,
      last,
    },
  };
};

const toPaginatedListResponse = <T>(page: PagedListBody<T>): ApiResponse<T[], PageMeta> => ({
  success: true,
  data: page.data,
  meta: page.meta,
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
});

const asRecord = (value: unknown): Record<string, unknown> =>
  (value as Record<string, unknown>) || {};

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const sortAddressesForList = <
  T extends { isDefault: boolean; createdAt?: string },
>(
  list: T[]
): T[] =>
  [...list].sort((a, b) => {
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1;
    }
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });

let mockUser = clone(MOCK_USER_PROFILE);
let mockAddresses = clone(MOCK_ADDRESSES.length > 0 ? MOCK_ADDRESSES : MOCK_USER_ADDRESSES);
let mockProducts = clone(MOCK_PRODUCTS_DATA);
let mockCart = clone(MOCK_CART_DATA);
let mockOrders = clone(MOCK_ORDERS_DATA);
let mockPayment: PaymentIntent = clone(MOCK_PAYMENT_INTENT);
let mockReviews = clone(MOCK_REVIEWS);
let mockNotifications = clone(MOCK_NOTIFICATIONS);

const delay = async () => new Promise(resolve => setTimeout(resolve, 120));

const recalculateCart = () => {
  const subtotal = mockCart.items.reduce((sum, item) => sum + item.total, 0);
  const totalItems = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = subtotal >= 200 ? 20 : MOCK_CART_SUMMARY.discount;

  mockCart = {
    ...mockCart,
    totalItems,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    updatedAt: new Date().toISOString(),
  };
};

const findProductById = (productId: string): Product | undefined =>
  mockProducts.find(product => product.id === productId);

const createOrderFromCart = () => {
  const now = new Date().toISOString();
  const orderId = `o-${mockOrders.length + 1}`;
  const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${
    String(mockOrders.length + 1).padStart(4, '0')
  }`;

  const order: Order = {
    id: orderId,
    orderNumber,
    userId: mockUser.id,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    items: mockCart.items.map(item => ({
      id: `oi-${item.id}`,
      productId: item.productId,
      productName: item.productName,
      productImageUrl: item.productImageUrl,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.total,
    })),
    subtotal: mockCart.subtotal,
    discount: mockCart.discount,
    shipping: 3,
    tax: 1,
    total: mockCart.total + 4,
    shippingAddress: {
      ...(mockAddresses[0] || {
        id: 'addr-1',
        fullName: 'Mock User',
        phone: '0900000000',
        addressLine1: 'Mock Address',
        city: 'Ho Chi Minh City',
        district: 'District 1',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: true,
        addressType: 'SHIPPING' as const,
        createdAt: now,
      }),
    },
    customerName: mockUser.fullName,
    customerEmail: mockUser.email,
    customerPhone: mockUser.phone || '0900000000',
    orderedAt: now,
    createdAt: now,
  };

  mockOrders = [order, ...mockOrders];

  mockCart = {
    ...mockCart,
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    updatedAt: now,
  };

  return order;
};

export const handleMockApiRequest = async <T>(
  method: MockHttpMethod,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T | undefined> => {
  await delay();

  const cleanUrl = url.split('?')[0];
  const params = asRecord(config?.params);

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.LOGIN) {
    const credentials = asRecord(data);
    const userEmail = String(credentials.email || MOCK_AUTH_USER.email);

    return toResponse({
      ...MOCK_AUTH_RESPONSE,
      user: {
        ...MOCK_AUTH_USER,
        ...mockUser,
        email: userEmail,
      },
    }) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.REGISTER) {
    const payload = asRecord(data);
    mockUser = {
      ...mockUser,
      email: String(payload.email || mockUser.email),
      fullName: String(payload.fullName || mockUser.fullName),
      phone: typeof payload.phone === 'string' ? payload.phone : mockUser.phone,
    };
    return toResponse(mockUser) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.REFRESH) {
    return toResponse(MOCK_AUTH_RESPONSE) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.LOGOUT) {
    return undefined;
  }

  if (method === 'get' && (cleanUrl === AUTH_ENDPOINTS.ME || cleanUrl === API_ENDPOINTS.USER.PROFILE)) {
    return toResponse(mockUser) as T;
  }

  if (method === 'put' && cleanUrl === API_ENDPOINTS.USER.PROFILE) {
    const payload = asRecord(data);
    mockUser = {
      ...mockUser,
      ...(payload as Partial<typeof mockUser>),
    };
    return toResponse(mockUser) as T;
  }

  const addrBase = API_ENDPOINTS.USER.ADDRESSES;

  if (method === 'get' && cleanUrl === addrBase) {
    return toResponse(sortAddressesForList(mockAddresses)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.USER.ADDRESS_DEFAULT) {
    const def = mockAddresses.find(a => a.isDefault);
    if (def) return toResponse(def) as T;
    if (mockAddresses.length > 0) {
      return toResponse({ ...mockAddresses[0], isDefault: true }) as T;
    }
    return undefined;
  }

  if (
    method === 'get' &&
    cleanUrl.startsWith(`${addrBase}/`) &&
    cleanUrl !== API_ENDPOINTS.USER.ADDRESS_DEFAULT
  ) {
    const id = cleanUrl.slice(addrBase.length + 1);
    if (!id || id.includes('/')) return undefined;
    const found = mockAddresses.find(a => a.id === id);
    if (!found) return undefined;
    return toResponse(found) as T;
  }

  if (method === 'post' && cleanUrl === addrBase) {
    const payload = asRecord(data);
    const now = new Date().toISOString();
    const isFirst = mockAddresses.length === 0;
    const wantsDefault = payload.isDefault === true || isFirst;

    let list = mockAddresses.map(a => ({ ...a }));
    if (wantsDefault) {
      list = list.map(a => ({ ...a, isDefault: false }));
    }

    const newAddr = {
      id: `addr-${mockAddresses.length + 1}-${Date.now()}`,
      fullName: String(payload.fullName || mockUser.fullName),
      phone: String(payload.phone || mockUser.phone || '0900000000'),
      addressLine1: String(payload.addressLine1 || 'Mock Address'),
      addressLine2:
        typeof payload.addressLine2 === 'string' && payload.addressLine2
          ? payload.addressLine2
          : null,
      city: String(payload.city || 'Ho Chi Minh City'),
      district:
        typeof payload.district === 'string' && payload.district ? payload.district : null,
      ward: typeof payload.ward === 'string' && payload.ward ? payload.ward : null,
      postalCode:
        typeof payload.postalCode === 'string' && payload.postalCode ? payload.postalCode : null,
      country: String(payload.country || 'Vietnam'),
      isDefault: wantsDefault,
      addressType: (typeof payload.addressType === 'string' && payload.addressType
        ? payload.addressType
        : 'SHIPPING') as 'SHIPPING' | 'BILLING' | 'BOTH',
      createdAt: now,
      updatedAt: now,
    };

    mockAddresses = sortAddressesForList([...list, newAddr]);
    const created = mockAddresses.find(a => a.id === newAddr.id);
    return toResponse(created || newAddr) as T;
  }

  if (method === 'put' && cleanUrl.startsWith(`${addrBase}/`) && cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1).replace(/\/default$/, '');
    if (!id) return undefined;
    const idx = mockAddresses.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    mockAddresses = sortAddressesForList(
      mockAddresses.map(a =>
        a.id === id ? { ...a, isDefault: true, updatedAt: now } : { ...a, isDefault: false }
      )
    );
    const updated = mockAddresses.find(a => a.id === id);
    if (updated) return toResponse(updated) as T;
  }

  if (method === 'put' && cleanUrl.startsWith(`${addrBase}/`) && !cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1);
    if (!id || id.includes('/')) return undefined;
    const payload = asRecord(data);
    const now = new Date().toISOString();
    let list = mockAddresses.map(a => ({ ...a }));
    if (payload.isDefault === true) {
      list = list.map(a => ({ ...a, isDefault: false }));
    }
    mockAddresses = sortAddressesForList(
      list.map(a => {
        if (a.id !== id) return a;
        return {
          ...a,
          fullName: typeof payload.fullName === 'string' ? payload.fullName : a.fullName,
          phone: typeof payload.phone === 'string' ? payload.phone : a.phone,
          addressLine1:
            typeof payload.addressLine1 === 'string' ? payload.addressLine1 : a.addressLine1,
          addressLine2:
            typeof payload.addressLine2 === 'string' ? payload.addressLine2 : a.addressLine2,
          city: typeof payload.city === 'string' ? payload.city : a.city,
          district: typeof payload.district === 'string' ? payload.district : a.district,
          ward: typeof payload.ward === 'string' ? payload.ward : a.ward,
          postalCode: typeof payload.postalCode === 'string' ? payload.postalCode : a.postalCode,
          country: typeof payload.country === 'string' ? payload.country : a.country,
          addressType:
            typeof payload.addressType === 'string'
              ? (payload.addressType as 'SHIPPING' | 'BILLING' | 'BOTH')
              : a.addressType,
          isDefault:
            typeof payload.isDefault === 'boolean' ? payload.isDefault : a.isDefault,
          updatedAt: now,
        };
      })
    );
    const updated = mockAddresses.find(a => a.id === id);
    if (updated) return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith(`${addrBase}/`) && !cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1);
    if (!id || id.includes('/')) return undefined;
    const removed = mockAddresses.find(a => a.id === id);
    if (!removed) return undefined;
    const wasDefault = removed.isDefault;
    mockAddresses = mockAddresses.filter(a => a.id !== id);
    if (wasDefault && mockAddresses.length > 0) {
      const pickId = mockAddresses[0].id;
      mockAddresses = sortAddressesForList(
        mockAddresses.map(a => ({ ...a, isDefault: a.id === pickId }))
      );
    }
    return toResponse(null) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.CATEGORIES) {
    return toResponse(MOCK_CATEGORIES) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.BRANDS) {
    return toResponse(MOCK_BRANDS) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.BRANDS_ACTIVE) {
    return toResponse(MOCK_BRANDS.filter(brand => brand.active)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.FEATURED) {
    const featuredProducts = mockProducts.filter(product => product.featured);
    const page = toNumber(params.page, 0);
    const size = toNumber(params.size, 20);
    return toPaginatedListResponse(toPage(featuredProducts, page, size)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.SEARCH) {
    const keyword = String(params.keyword || '').toLowerCase();
    const minPrice = toNumber(params.minPrice, 0);
    const maxPrice = toNumber(params.maxPrice, Number.MAX_SAFE_INTEGER);
    const filtered = mockProducts.filter(product => {
      const nameMatch =
        keyword.length === 0 ||
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword);
      const price = product.salePrice || product.price;
      return nameMatch && price >= minPrice && price <= maxPrice;
    });

    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.LIST) {
    let filtered = [...mockProducts];

    if (params.categoryId) {
      filtered = filtered.filter(product => product.category?.id === String(params.categoryId));
    }

    if (params.brandId) {
      filtered = filtered.filter(product => product.brand?.id === String(params.brandId));
    }

    if (params.featured !== undefined) {
      const featured = params.featured === true || params.featured === 'true';
      filtered = filtered.filter(product => product.featured === featured);
    }

    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/slug/')) {
    const slug = cleanUrl.replace('/products/slug/', '');
    const product = mockProducts.find(item => item.slug === slug) || mockProducts[0];
    return toResponse(product) as T;
  }

  if (
    method === 'get' &&
    cleanUrl.startsWith('/products/') &&
    !cleanUrl.includes('/images/upload')
  ) {
    const id = cleanUrl.replace('/products/', '');
    const product = mockProducts.find(item => item.id === id) || mockProducts[0];
    return toResponse(product) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CART.ROOT) {
    return toResponse(mockCart) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CART.SUMMARY) {
    recalculateCart();
    return toResponse({
      totalItems: mockCart.totalItems,
      subtotal: mockCart.subtotal,
      discount: mockCart.discount,
      total: mockCart.total,
    }) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CART.ITEMS) {
    const payload = asRecord(data);
    const productId = String(payload.productId || MOCK_ADD_TO_CART_REQUEST.productId);
    const quantity = toNumber(payload.quantity, MOCK_ADD_TO_CART_REQUEST.quantity);
    const product = findProductById(productId);

    if (product) {
      const existing = mockCart.items.find(item => item.productId === productId);
      const unitPrice = product.salePrice || product.price;

      if (existing) {
        existing.quantity += quantity;
        existing.total = existing.quantity * unitPrice;
      } else {
        mockCart.items.push({
          id: `ci-${mockCart.items.length + 1}`,
          productId,
          productName: product.name,
          productImageUrl: product.images?.[0]?.imageUrl || '',
          quantity,
          price: unitPrice,
          total: quantity * unitPrice,
          inStock: (product.stockQuantity ?? 0) > 0,
          createdAt: new Date().toISOString(),
        });
      }

      recalculateCart();
    }

    return toResponse(mockCart) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/cart/items/')) {
    const itemId = cleanUrl.replace('/cart/items/', '');
    const payload = asRecord(data);
    const quantity = toNumber(payload.quantity, MOCK_UPDATE_CART_ITEM_REQUEST.quantity);

    mockCart.items = mockCart.items.map(item => {
      if (item.id !== itemId) {
        return item;
      }

      return {
        ...item,
        quantity,
        total: item.price * quantity,
      };
    });

    recalculateCart();
    return toResponse(mockCart) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/cart/items/')) {
    const itemId = cleanUrl.replace('/cart/items/', '');
    mockCart.items = mockCart.items.filter(item => item.id !== itemId);
    recalculateCart();
    return toResponse(mockCart) as T;
  }

  if (method === 'delete' && cleanUrl === API_ENDPOINTS.CART.ROOT) {
    mockCart = {
      ...mockCart,
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };
    return undefined;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.ORDERS.ROOT) {
    return toPaginatedListResponse(
      toPage(mockOrders, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/orders/number/')) {
    const orderNumber = cleanUrl.replace('/orders/number/', '');
    const order = mockOrders.find(item => item.orderNumber === orderNumber) || mockOrders[0];
    return toResponse(order) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/orders/')) {
    const id = cleanUrl.replace('/orders/', '');
    if (!id.includes('/')) {
      const order = mockOrders.find(item => item.id === id) || mockOrders[0];
      return toResponse(order) as T;
    }
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.ORDERS.ROOT) {
    if (mockCart.items.length === 0) {
      mockCart = clone(MOCK_CART_DATA);
      recalculateCart();
    }

    const created = createOrderFromCart();
    const payload = asRecord(data);
    if (payload.paymentMethod && Object.values(PaymentMethod).includes(payload.paymentMethod as PaymentMethod)) {
      created.paymentMethod = payload.paymentMethod as PaymentMethod;
    }

    if (payload.shippingAddress) {
      const shippingAddress = asRecord(payload.shippingAddress);
      created.shippingAddress = {
        id: 'addr-temp',
        fullName: String(shippingAddress.fullName || created.shippingAddress.fullName),
        phone: String(shippingAddress.phone || created.shippingAddress.phone),
        addressLine1: String(shippingAddress.addressLine1 || created.shippingAddress.addressLine1),
        addressLine2: typeof shippingAddress.addressLine2 === 'string' ? shippingAddress.addressLine2 : undefined,
        city: String(shippingAddress.city || created.shippingAddress.city),
        district: String(
          shippingAddress.district ??
            shippingAddress.state ??
            created.shippingAddress.district ??
            ''
        ),
        ward:
          typeof shippingAddress.ward === 'string' ? shippingAddress.ward : created.shippingAddress.ward,
        postalCode: String(
          shippingAddress.postalCode ??
            shippingAddress.zipCode ??
            created.shippingAddress.postalCode ??
            ''
        ),
        country: String(shippingAddress.country || created.shippingAddress.country),
        isDefault: false,
        addressType: created.shippingAddress.addressType ?? 'SHIPPING',
        createdAt: created.shippingAddress.createdAt,
      };
    }

    return toResponse(created) as T;
  }

  if (method === 'post' && cleanUrl.endsWith('/cancel') && cleanUrl.startsWith('/orders/')) {
    const id = cleanUrl.replace('/orders/', '').replace('/cancel', '');
    mockOrders = mockOrders.map(order =>
      order.id === id ? { ...order, status: OrderStatus.CANCELLED } : order
    );
    const cancelled = mockOrders.find(order => order.id === id) || mockOrders[0];
    return toResponse(cancelled) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PAYMENTS.ROOT) {
    const payload = asRecord(data);
    mockPayment = {
      ...MOCK_PAYMENT_INTENT,
      paymentId: `pay-${Date.now()}`,
      amount: toNumber(payload.amount, MOCK_CREATE_PAYMENT_REQUEST.amount),
      status: 'PENDING',
    };
    return toResponse(mockPayment) as T;
  }

  if (method === 'post' && cleanUrl.startsWith('/payments/') && cleanUrl.endsWith('/confirm')) {
    mockPayment = clone(MOCK_CONFIRMED_PAYMENT_INTENT);
    return toResponse(mockPayment) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/payments/order/')) {
    return toResponse(mockPayment) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/payments/')) {
    return toResponse(mockPayment) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.REVIEWS.ROOT) {
    const payload = asRecord(data);
    const next = {
      id: `rev-${mockReviews.length + 1}`,
      userName: mockUser.fullName,
      rating: toNumber(payload.rating, MOCK_CREATE_REVIEW_REQUEST.rating),
      title: String(payload.title || MOCK_CREATE_REVIEW_REQUEST.title),
      comment: String(payload.comment || MOCK_CREATE_REVIEW_REQUEST.comment),
      verified: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockReviews = [next, ...mockReviews];
    return toResponse(next) as T;
  }

  if (method === 'get' && cleanUrl.includes('/summary') && cleanUrl.startsWith('/reviews/product/')) {
    const totalReviews = mockReviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              mockReviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          )
        : MOCK_REVIEW_SUMMARY.averageRating;

    const distribution: Record<string, number> = {
      '5': 0,
      '4': 0,
      '3': 0,
      '2': 0,
      '1': 0,
    };

    mockReviews.forEach(review => {
      const key = String(Math.max(1, Math.min(5, Math.round(review.rating))));
      distribution[key] = (distribution[key] || 0) + 1;
    });

    return toResponse({
      averageRating,
      totalReviews,
      distribution,
    }) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/reviews/product/')) {
    return toPaginatedListResponse(
      toPage(mockReviews, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'post' && cleanUrl.startsWith('/reviews/') && cleanUrl.endsWith('/vote')) {
    return undefined;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.SHIPPING.CALCULATE_FEE) {
    const payload = asRecord(data);
    const weight = toNumber(payload.weight, MOCK_SHIPPING_FEE_REQUEST.weight);

    return toResponse({
      ...MOCK_SHIPPING_FEE_RESPONSE,
      fee: weight > 2000 ? MOCK_SHIPPING_FEE_RESPONSE.fee + 12000 : MOCK_SHIPPING_FEE_RESPONSE.fee,
    }) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/shipping/order/')) {
    return toResponse(MOCK_SHIPMENT) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/shipping/track/')) {
    return toResponse(MOCK_SHIPMENT) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.NOTIFICATIONS.MY) {
    return toPaginatedListResponse(
      toPage(mockNotifications, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/notifications/') && cleanUrl.endsWith('/mark-read')) {
    const id = cleanUrl.replace('/notifications/', '').replace('/mark-read', '');
    mockNotifications = mockNotifications.map(notification =>
      notification.id === id ? { ...notification, status: 'SENT' } : notification
    );
    return undefined;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH) {
    return undefined;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.CATEGORIES_TREE) {
    return toResponse(MOCK_CATEGORIES) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/slug/')) {
    const slug = cleanUrl.replace('/categories/slug/', '');
    const category = MOCK_CATEGORIES.find(item => item.slug === slug) || MOCK_CATEGORIES[0];
    return toResponse(category) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/')) {
    const id = cleanUrl.replace('/categories/', '');
    const category = MOCK_CATEGORIES.find(item => item.id === id) || MOCK_CATEGORIES[0];
    return toResponse(category) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/slug/')) {
    const slug = cleanUrl.replace('/brands/slug/', '');
    const brand = MOCK_BRANDS.find(item => item.slug === slug) || MOCK_BRANDS[0];
    return toResponse(brand) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '');
    const brand = MOCK_BRANDS.find(item => item.id === id) || MOCK_BRANDS[0];
    return toResponse(brand) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.CATEGORIES) {
    const payload = asRecord(data);
    const next = {
      id: `c-${MOCK_CATEGORIES.length + 1}`,
      name: String(payload.name || 'New Category'),
      slug: String(payload.slug || `new-category-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      productCount: 0,
      active: true,
    };
    return toResponse(next) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.BRANDS) {
    const payload = asRecord(data);
    const next = {
      id: `b-${MOCK_BRANDS.length + 1}`,
      name: String(payload.name || 'New Brand'),
      slug: String(payload.slug || `new-brand-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      active: true,
    };
    return toResponse(next) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.CREATE) {
    const payload = asRecord(data);
    const next = {
      ...mockProducts[0],
      id: `p-${mockProducts.length + 1}`,
      name: String(payload.name || 'New Product'),
      slug: String(payload.slug || `new-product-${Date.now()}`),
      description: String(payload.description || 'Mock product description'),
      price: toNumber(payload.price, 100),
      salePrice: toNumber(payload.salePrice, 80),
      featured: Boolean(payload.featured),
      stockQuantity: toNumber(payload.stockQuantity, 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts = [next, ...mockProducts];
    return toResponse(next) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/products/') && !cleanUrl.includes('/images/upload')) {
    const id = cleanUrl.replace('/products/', '');
    const payload = asRecord(data);

    mockProducts = mockProducts.map(product => {
      if (product.id !== id) {
        return product;
      }

      return {
        ...product,
        ...(payload as Partial<Product>),
        updatedAt: new Date().toISOString(),
      };
    });

    const updated = mockProducts.find(product => product.id === id) || mockProducts[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/products/')) {
    const id = cleanUrl.replace('/products/', '');
    mockProducts = mockProducts.filter(product => product.id !== id);
    return undefined;
  }

  if (method === 'post' && cleanUrl.includes('/images/upload')) {
    const id = cleanUrl.replace('/products/', '').replace('/images/upload', '');
    const product = mockProducts.find(item => item.id === id) || mockProducts[0];
    return toResponse(product) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/categories/')) {
    const id = cleanUrl.replace('/categories/', '');
    const payload = asRecord(data);
    const category = MOCK_CATEGORIES.find(item => item.id === id) || MOCK_CATEGORIES[0];
    return toResponse({ ...category, ...payload }) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/categories/')) {
    return undefined;
  }

  if (method === 'put' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '');
    const payload = asRecord(data);
    const brand = MOCK_BRANDS.find(item => item.id === id) || MOCK_BRANDS[0];
    return toResponse({ ...brand, ...payload }) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/brands/')) {
    return undefined;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/category/')) {
    const categoryId = cleanUrl.replace('/products/category/', '');
    const filtered = mockProducts.filter(product => product.category?.id === categoryId);
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/brand/')) {
    const brandId = cleanUrl.replace('/products/brand/', '');
    const filtered = mockProducts.filter(product => product.brand?.id === brandId);
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.PRICE_RANGE) {
    const min = toNumber(params.minPrice, 0);
    const max = toNumber(params.maxPrice, Number.MAX_SAFE_INTEGER);
    const filtered = mockProducts.filter(product => {
      const price = product.salePrice || product.price;
      return price >= min && price <= max;
    });
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.PUBLISHED) {
    const filtered = mockProducts.filter(product => product.status === 'PUBLISHED');
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 20))
    ) as T;
  }

  return undefined;
};
