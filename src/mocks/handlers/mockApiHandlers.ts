import { API_ENDPOINTS, AUTH_ENDPOINTS } from '@/constants';
import { MOCK_ADDRESSES, MOCK_ADMIN_USERS, MOCK_USER_PROFILE } from '@/mocks/user/userMockData';
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
  MOCK_UPDATE_CART_ITEM_REQUEST,
} from '@/mocks/cart/cartMockData';
import {
  MOCK_ORDERS_DATA,
} from '@/mocks/order/orderMockData';
import {
  MOCK_PAYMENT_INTENT,
  MOCK_CREATE_PAYMENT_REQUEST,
} from '@/mocks/payment/paymentMockData';
import {
  MOCK_CREATE_REVIEW_REQUEST,
  MOCK_REVIEW_SUMMARY,
  MOCK_REVIEWS,
} from '@/mocks/review/reviewMockData';
import {
  MOCK_SHIPMENT,
  MOCK_SHIPPING_FEE_REQUEST,
} from '@/mocks/shipping/shippingMockData';
import {
  MOCK_NOTIFICATIONS,
} from '@/mocks/notification/notificationMockData';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import { PaymentMethod, type Order, OrderStatus, PaymentStatus } from '@/types/order/order';
import type { OrderShippingAddress } from '@/types/order/order';
import type { PaymentResponse } from '@/types/payment/payment';
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
let mockUsersList = clone(MOCK_ADMIN_USERS);
let mockAddresses = clone(MOCK_ADDRESSES.length > 0 ? MOCK_ADDRESSES : MOCK_USER_ADDRESSES);
let mockCategories = clone(MOCK_CATEGORIES);
let mockBrands = clone(MOCK_BRANDS);
let mockProducts = clone(MOCK_PRODUCTS_DATA);
let mockOrders = clone(MOCK_ORDERS_DATA);
let mockPayment: PaymentResponse = clone(MOCK_PAYMENT_INTENT);
let mockReviews = clone(MOCK_REVIEWS);
let mockNotifications = clone(MOCK_NOTIFICATIONS);
let mockCart = clone(MOCK_CART_DATA);

const delay = async () => new Promise(resolve => setTimeout(resolve, 120));


const findProductById = (productId: string): Product | undefined =>
  mockProducts.find(product => product.id === productId);

const recalculateCart = (): void => {
  const subtotal = mockCart.items.reduce((sum, item) => sum + item.total, 0);
  const totalItems = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = mockCart.discount ?? 0;

  mockCart = {
    ...mockCart,
    totalItems,
    subtotal,
    total: Math.max(0, subtotal - discount),
    updatedAt: new Date().toISOString(),
  };
};


const createOrderFromCart = (payload: Record<string, unknown> = {}): Order => {
  const now = new Date().toISOString();
  const payloadShipping = asRecord(payload.shippingAddress);

  // Map new contract shippingAddress fields
  const shippingAddress: OrderShippingAddress = {
    recipientName: String(
      payloadShipping.recipientName ||
      payloadShipping.fullName ||
      mockUser.fullName ||
      'Customer'
    ),
    phone: String(payloadShipping.phone || mockUser.phone || '0900000000'),
    address: String(
      payloadShipping.address ||
      payloadShipping.addressLine1 ||
      '123 Nguyen Hue Street'
    ),
    city: String(payloadShipping.city || 'Ho Chi Minh'),
    province: String(payloadShipping.province || payloadShipping.state || 'Ho Chi Minh'),
    zipCode: String(payloadShipping.zipCode || '700000'),
  };

  // Use items from payload if provided, otherwise use cart
  const payloadItems = Array.isArray(payload.items) ? payload.items : [];
  const orderItems = payloadItems.length > 0
    ? payloadItems.map((item: Record<string, unknown>, idx: number) => {
        const pid = String(item.productId || `PROD-${idx + 1}`);
        const explicitImage = typeof item.productImageUrl === 'string' ? String(item.productImageUrl) : undefined;
        const productFromCatalog = findProductById(pid);
        const inferredImage = productFromCatalog?.images?.[0]?.imageUrl;

        return {
          id: `oi-${Date.now()}-${idx}`,
          productId: pid,
          productName: String(item.productName || 'Product'),
          quantity: toNumber(item.quantity, 1),
          price: toNumber(item.price, 0),
          productImageUrl: explicitImage ?? inferredImage,
          subtotal: toNumber(item.quantity, 1) * toNumber(item.price, 0),
        };
      })
    : mockCart.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        productImageUrl: item.productImageUrl,
        subtotal: item.total,
      }));

  const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
  const shippingFee = 30000;
  const tax = Math.round(subtotal * 0.1);
  const paymentMethod = String(payload.paymentMethod || 'COD') as PaymentMethod;
  const isVnpay = paymentMethod === PaymentMethod.VNPAY || (paymentMethod as string) === 'VNPAY';

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(mockOrders.length + 1).padStart(4, '0')}`,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod[paymentMethod as keyof typeof PaymentMethod] ?? PaymentMethod.COD,
    paymentUrl: isVnpay ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=1' : null,
    shipmentId: null,
    items: orderItems,
    subtotal,
    discount: 0,
    shipping: shippingFee,
    tax,
    total: subtotal + shippingFee + tax,
    shippingAddress,
    createdAt: now,
    // legacy
    userId: mockUser.id,
    customerName: mockUser.fullName || mockUser.email || 'Customer',
    customerEmail: mockUser.email,
    customerPhone: mockUser.phone || '0900000000',
    notes: typeof payload.note === 'string' ? payload.note : undefined,
    orderedAt: now,
    updatedAt: now,
  };

  if (!isVnpay) {
    // Only clear cart for non-VNPAY orders (VNPAY still pending until confirmed)
    mockCart = clone(MOCK_CART_DATA);
  }
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

  if (method === 'get' && cleanUrl === API_ENDPOINTS.USERS.LIST) {
    return toPaginatedListResponse(
      toPage(mockUsersList, toNumber(params.page, 0), toNumber(params.size, 10)),
    ) as T;
  }

  const userDetailMatch = cleanUrl.match(/^\/users\/([^/]+)$/);
  if (method === 'get' && userDetailMatch) {
    const id = userDetailMatch[1];
    const user = mockUsersList.find((entry) => entry.id === id);
    if (!user) return undefined;
    return toResponse(user) as T;
  }

  const userRolesMatch = cleanUrl.match(/^\/users\/([^/]+)\/roles$/);
  if (method === 'put' && userRolesMatch) {
    const id = userRolesMatch[1];
    const payload = asRecord(data);
    const roles = Array.isArray(payload.roles)
      ? payload.roles.map((role) => String(role))
      : [];
    const index = mockUsersList.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    const updated = { ...mockUsersList[index], roles };
    mockUsersList = mockUsersList.map((user, i) => (i === index ? updated : user));
    return toResponse(updated) as T;
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

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.LIST) {
    return toResponse(mockCategories) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.ACTIVE) {
    return toResponse(mockCategories.filter((category) => category.active !== false)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.BRANDS.LIST) {
    return toResponse(mockBrands) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.BRANDS.ACTIVE) {
    return toResponse(mockBrands.filter((brand) => brand.active)) as T;
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
    if (mockCart.items.length === 0 && !Array.isArray((asRecord(data)).items)) {
      mockCart = clone(MOCK_CART_DATA);
      recalculateCart();
    }

    const payload = asRecord(data);
    const created = createOrderFromCart(payload);
    mockOrders = [created, ...mockOrders];

    return toResponse(created) as T;
  }

  // PUT /orders/{id}/payment-confirmed
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/payment-confirmed$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/payment-confirmed', '');
    mockOrders = mockOrders.map(order =>
      order.id === id
        ? { ...order, status: OrderStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID }
        : order
    );
    const confirmed = mockOrders.find(o => o.id === id) || mockOrders[0];
    return toResponse(confirmed) as T;
  }

  // PUT /orders/{id}/delivered
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/delivered$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/delivered', '');
    mockOrders = mockOrders.map(order =>
      order.id === id
        ? { ...order, status: OrderStatus.DELIVERED, paymentStatus: PaymentStatus.PAID }
        : order
    );
    const delivered = mockOrders.find(o => o.id === id) || mockOrders[0];
    return toResponse(delivered) as T;
  }

  // PUT /orders/{id}/confirm
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/confirm$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/confirm', '');
    mockOrders = mockOrders.map(order =>
      order.id === id ? { ...order, status: OrderStatus.CONFIRMED } : order
    );
    const confirmed = mockOrders.find(o => o.id === id) || mockOrders[0];
    return toResponse(confirmed) as T;
  }

  // PUT /orders/{id}/status (cancel)
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/status$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/status', '');
    const payload = asRecord(data);
    const newStatus = String(payload.status || 'CANCELLED') as OrderStatus;
    mockOrders = mockOrders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    const updated = mockOrders.find(o => o.id === id) || mockOrders[0];
    return toResponse(updated) as T;
  }

  // POST /payments/create
  if (method === 'post' && cleanUrl === '/payments/create') {
    const payload = asRecord(data);
    mockPayment = {
      ...MOCK_PAYMENT_INTENT,
      id: Date.now(),
      paymentNumber: `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`,
      orderId: String(payload.orderId || mockPayment.orderId),
      orderNumber: String(payload.orderNumber || mockPayment.orderNumber),
      amount: toNumber(payload.amount, MOCK_CREATE_PAYMENT_REQUEST.amount),
      paymentMethod: (payload.paymentMethod as 'COD' | 'VNPAY') || 'COD',
      paymentUrl:
        payload.paymentMethod === 'VNPAY'
          ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=1'
          : null,
      status: 'PENDING',
    } as PaymentResponse;
    return toResponse(mockPayment) as T;
  }

  // PUT /payments/order/{orderNumber}/success
  if (method === 'put' && cleanUrl.match(/^\/payments\/order\/([^/]+)\/success$/)) {
    mockPayment = { ...mockPayment, status: 'PAID', paymentUrl: null };
    return toResponse(mockPayment) as T;
  }

  // GET /payments/order/{orderNumber}
  if (method === 'get' && cleanUrl.startsWith('/payments/order/')) {
    return toResponse(mockPayment) as T;
  }

  // GET /payments/{id}
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

  // POST /shipping/calculate-fee
  if (method === 'post' && cleanUrl === API_ENDPOINTS.SHIPPING.CALCULATE_FEE) {
    const payload = asRecord(data);
    const weight = toNumber(payload.weight, MOCK_SHIPPING_FEE_REQUEST.weight);
    const baseFee = weight > 2000 ? 45000 : 30000;

    return toResponse({
      shippingFee: baseFee,
      estimatedDays: weight > 5000 ? 4 : 2,
    }) as T;
  }

  // POST /shipping/create
  if (method === 'post' && cleanUrl === '/shipping/create') {
    const payload = asRecord(data);
    return toResponse({
      shipmentId: Date.now(),
      shipmentNumber: `SHIP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0001`,
      orderId: String(payload.orderId || ''),
      orderNumber: String(payload.orderNumber || ''),
      status: 'PENDING',
      shippingFee: toNumber(payload.shippingFee, 30000),
      codAmount: toNumber(payload.codAmount, 0),
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    }) as T;
  }

  // GET /shipping/{id}
  if (method === 'get' && cleanUrl.match(/^\/shipping\/\d+$/)) {
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

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.TREE) {
    return toResponse(mockCategories) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/slug/')) {
    const slug = cleanUrl.replace('/categories/slug/', '');
    const category = mockCategories.find((item) => item.slug === slug) || mockCategories[0];
    return toResponse(category) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/') && !cleanUrl.endsWith('/tree')) {
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    if (id && id !== 'slug') {
      const category = mockCategories.find((item) => item.id === id) || mockCategories[0];
      return toResponse(category) as T;
    }
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/slug/')) {
    const slug = cleanUrl.replace('/brands/slug/', '');
    const brand = mockBrands.find((item) => item.slug === slug) || mockBrands[0];
    return toResponse(brand) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    if (id && id !== 'slug') {
      const brand = mockBrands.find((item) => item.id === id) || mockBrands[0];
      return toResponse(brand) as T;
    }
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CATEGORIES.LIST) {
    const payload = asRecord(data);
    const next = {
      id: `c-${mockCategories.length + 1}`,
      name: String(payload.name || 'New Category'),
      slug: String(payload.slug || `new-category-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      productCount: 0,
      displayOrder: toNumber(payload.displayOrder, mockCategories.length + 1),
      active: payload.active !== false,
    };
    mockCategories = [next, ...mockCategories];
    return toResponse(next) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.BRANDS.LIST) {
    const payload = asRecord(data);
    const next = {
      id: `b-${mockBrands.length + 1}`,
      name: String(payload.name || 'New Brand'),
      slug: String(payload.slug || `new-brand-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      active: payload.active !== false,
    };
    mockBrands = [next, ...mockBrands];
    return toResponse(next) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.CREATE) {
    const payload = asRecord(data);
    const description =
      typeof payload.description === 'string' && payload.description.trim()
        ? payload.description.trim()
        : null;
    const shortDescription =
      typeof payload.shortDescription === 'string' && payload.shortDescription.trim()
        ? payload.shortDescription.trim()
        : null;
    const next: Product = {
      ...mockProducts[0],
      id: `p-${mockProducts.length + 1}`,
      name: String(payload.name || 'New Product'),
      slug: String(payload.slug || `new-product-${Date.now()}`),
      description,
      shortDescription,
      price: toNumber(payload.price, 100),
      compareAtPrice:
        payload.compareAtPrice != null ? toNumber(payload.compareAtPrice, 0) : null,
      salePrice: toNumber(payload.salePrice, 80),
      featured: Boolean(payload.featured),
      published: payload.published !== false,
      stockQuantity: toNumber(payload.stockQuantity, 100),
      sku: typeof payload.sku === 'string' ? payload.sku : null,
      status:
        typeof payload.status === 'string'
          ? (payload.status as Product['status'])
          : mockProducts[0].status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts = [next, ...mockProducts];
    return toResponse(next) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/products/') && !cleanUrl.includes('/images/upload')) {
    const id = cleanUrl.replace('/products/', '');
    const payload = asRecord(data);
    const description =
      typeof payload.description === 'string'
        ? payload.description.trim() || null
        : undefined;
    const shortDescription =
      typeof payload.shortDescription === 'string'
        ? payload.shortDescription.trim() || null
        : undefined;

    mockProducts = mockProducts.map(product => {
      if (product.id !== id) {
        return product;
      }

      return {
        ...product,
        ...(payload as Partial<Product>),
        ...(description !== undefined ? { description } : {}),
        ...(shortDescription !== undefined ? { shortDescription } : {}),
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
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    const payload = asRecord(data);
    mockCategories = mockCategories.map((category) =>
      category.id === id ? { ...category, ...(payload as Partial<typeof category>) } : category,
    );
    const updated = mockCategories.find((category) => category.id === id) || mockCategories[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/categories/')) {
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    mockCategories = mockCategories.filter((category) => category.id !== id);
    return undefined;
  }

  if (method === 'put' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    const payload = asRecord(data);
    mockBrands = mockBrands.map((brand) =>
      brand.id === id ? { ...brand, ...(payload as Partial<typeof brand>) } : brand,
    );
    const updated = mockBrands.find((brand) => brand.id === id) || mockBrands[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    mockBrands = mockBrands.filter((brand) => brand.id !== id);
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
