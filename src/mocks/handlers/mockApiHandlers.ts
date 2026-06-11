import { API_ENDPOINTS, AUTH_ENDPOINTS, STORAGE_ENDPOINTS } from '@/constants';
import { IMAGES } from '@/constants/images';
import {
  findMockLoginAccount,
  MOCK_AUTH_RESPONSE,
  mockAuthFailure,
} from '@/mocks/auth/authMockData';
import {
  MOCK_ADD_TO_CART_REQUEST,
  MOCK_UPDATE_CART_ITEM_REQUEST,
} from '@/mocks/cart/cartMockData';
import {
  MOCK_CREATE_PAYMENT_REQUEST,
  MOCK_PAYMENT_INTENT,
} from '@/mocks/payment/paymentMockData';
import {
  MOCK_CREATE_REVIEW_REQUEST,
  MOCK_REVIEW_SUMMARY,
} from '@/mocks/review/reviewMockData';
import {
  MOCK_SHIPMENT_RESPONSE,
  MOCK_SHIPPING_FEE_REQUEST,
} from '@/mocks/shipping/shippingMockData';
import {
  buildSeedCart,
  findMockProductById,
  getMockAddresses,
  getMockBrands,
  getMockCart,
  getMockCategories,
  getMockChatConversations,
  getMockChatMessages,
  getMockNotifications,
  getMockOrders,
  getMockPayment,
  getMockProducts,
  getMockReviews,
  getMockUser,
  getMockUsers,
  initMockState,
  mergeStoredMockUser,
  recalculateMockCart,
  setMockAddresses,
  setMockBrands,
  setMockCart,
  setMockCategories,
  setMockChatConversations,
  setMockChatMessages,
  setMockNotifications,
  setMockOrders,
  setMockPayment,
  setMockProducts,
  setMockReviews,
  setMockUser,
  setMockUsers,
  updateMockUserProfile,
} from '@/mocks/storage/mockState';
import type { User } from '@/types/auth/auth';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import type { ConversationInbound, MessageInbound } from '@/types/chat/chat';
import { PaymentMethod, type Order, OrderStatus, PaymentStatus, ShipmentStatus } from '@/types/order/order';
import type { OrderShippingAddress } from '@/types/order/order';
import type { PaymentResponse } from '@/types/payment/payment';
import type { Product } from '@/types/product/product';
import type { AxiosRequestConfig } from 'axios';

export type MockHttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const toResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
});

const toEmptySuccessResponse = (): ApiResponse<null> => toResponse(null);

type PagedListBody<T> = { data: T[]; meta: PageMeta };

const toPage = <T>(items: T[], page = 0, size = 10): PagedListBody<T> => {
  const safeSize = size > 0 ? size : 10;
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

const delay = async () => new Promise(resolve => setTimeout(resolve, 120));

const touchMockOrder = (order: Order, patch: Partial<Order>): Order => ({
  ...order,
  ...patch,
  updatedAt: new Date().toISOString(),
});

const updateMockOrderById = (id: string, patch: Partial<Order>): Order | undefined => {
  let updated: Order | undefined;
  setMockOrders(
    getMockOrders().map(order => {
      if (order.id !== id) {
        return order;
      }
      updated = touchMockOrder(order, patch);
      return updated;
    }),
  );
  return updated;
};

const updateMockOrdersByShipmentId = (
  shipmentId: number,
  patch: Partial<Order>,
): void => {
  setMockOrders(
    getMockOrders().map(order =>
      order.shipmentId === shipmentId ? touchMockOrder(order, patch) : order,
    ),
  );
};

const readUploadFileAsDataUrl = (payload: unknown): Promise<string | null> =>
  new Promise(resolve => {
    if (!(payload instanceof FormData)) {
      resolve(null);
      return;
    }

    const file = payload.get('file');
    if (!(file instanceof File)) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

let mockShipmentState = { ...MOCK_SHIPMENT_RESPONSE };


const createOrderFromCart = (payload: Record<string, unknown> = {}): Order => {
  const now = new Date().toISOString();
  const payloadShipping = asRecord(payload.shippingAddress);

  // Map new contract shippingAddress fields
  const shippingAddress: OrderShippingAddress = {
    recipientName: String(
      payloadShipping.recipientName ||
      payloadShipping.fullName ||
      getMockUser().fullName ||
      'Customer'
    ),
    phone: String(payloadShipping.phone || getMockUser().phone || '0900000000'),
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
        const productFromCatalog = findMockProductById(pid);
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
    : getMockCart().items.map(item => ({
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
  const shipmentId = Date.now();

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(getMockOrders().length + 1).padStart(4, '0')}`,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: PaymentMethod[paymentMethod as keyof typeof PaymentMethod] ?? PaymentMethod.COD,
    paymentUrl: isVnpay ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=1' : null,
    shipmentId,
    shipmentStatus: ShipmentStatus.PENDING,
    items: orderItems,
    subtotal,
    discount: 0,
    shipping: shippingFee,
    tax,
    total: subtotal + shippingFee + tax,
    shippingAddress,
    createdAt: now,
    // legacy
    userId: getMockUser().id,
    customerName: getMockUser().fullName || getMockUser().email || 'Customer',
    customerEmail: getMockUser().email,
    customerPhone: getMockUser().phone || '0900000000',
    notes: typeof payload.note === 'string' ? payload.note : undefined,
    orderedAt: now,
    updatedAt: now,
  };

  mockShipmentState = {
    ...MOCK_SHIPMENT_RESPONSE,
    shipmentId,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: ShipmentStatus.PENDING,
    shippingFee,
    codAmount: paymentMethod === PaymentMethod.COD ? order.total : 0,
    recipientName: shippingAddress.recipientName,
    recipientPhone: shippingAddress.phone,
    address: shippingAddress.address,
    estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  if (!isVnpay) {
    // Only clear cart for non-VNPAY orders (VNPAY still pending until confirmed)
    setMockCart(buildSeedCart());
  }
  return order;
};


export const handleMockApiRequest = async <T>(
  method: MockHttpMethod,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T | undefined> => {
  initMockState();
  await delay();

  const cleanUrl = url.split('?')[0];
  const params = asRecord(config?.params);

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.LOGIN) {
    const credentials = asRecord(data);
    const email = String(credentials.email || '');
    const password = String(credentials.password || '');
    const account = findMockLoginAccount(email, password);

    if (!account) {
      return mockAuthFailure('Invalid email or password') as T;
    }

    const user = mergeStoredMockUser(account.user);
    setMockUser(user);

    return toResponse({
      ...MOCK_AUTH_RESPONSE,
      user,
    }) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.FORGOT_PASSWORD) {
    return toEmptySuccessResponse() as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.REGISTER) {
    const payload = asRecord(data);
    setMockUser({
      ...getMockUser(),
      email: String(payload.email || getMockUser().email),
      fullName: String(payload.fullName || getMockUser().fullName),
      phone: typeof payload.phone === 'string' ? payload.phone : getMockUser().phone,
    });
    return toResponse(getMockUser()) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.REFRESH) {
    return toResponse({
      ...MOCK_AUTH_RESPONSE,
      user: getMockUser(),
    }) as T;
  }

  if (method === 'post' && cleanUrl === AUTH_ENDPOINTS.LOGOUT) {
    return toEmptySuccessResponse() as T;
  }

  if (method === 'get' && (cleanUrl === AUTH_ENDPOINTS.ME || cleanUrl === API_ENDPOINTS.USER.PROFILE)) {
    return toResponse(getMockUser()) as T;
  }

  if (
    (method === 'put' || method === 'patch') &&
    cleanUrl === API_ENDPOINTS.USER.PROFILE
  ) {
    const payload = asRecord(data);
    const updated = updateMockUserProfile(payload as Partial<User>);
    return toResponse(updated) as T;
  }

  if (method === 'post' && cleanUrl === STORAGE_ENDPOINTS.UPLOAD) {
    const uploadedUrl = (await readUploadFileAsDataUrl(data)) ?? IMAGES.USER_AVATAR;
    return toResponse({
      fileId: `mock-file-${Date.now()}`,
      url: uploadedUrl,
    }) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.USERS.LIST) {
    return toPaginatedListResponse(
      toPage(getMockUsers(), toNumber(params.page, 0), toNumber(params.size, 10)),
    ) as T;
  }

  const userDetailMatch = cleanUrl.match(/^\/users\/([^/]+)$/);
  if (method === 'get' && userDetailMatch) {
    const id = userDetailMatch[1];
    const user = getMockUsers().find((entry) => entry.id === id);
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
    const index = getMockUsers().findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    const updated = { ...getMockUsers()[index], roles };
    setMockUsers(getMockUsers().map((user, i) => (i === index ? updated : user)));
    return toResponse(updated) as T;
  }

  const addrBase = API_ENDPOINTS.USER.ADDRESSES;

  if (method === 'get' && cleanUrl === addrBase) {
    return toResponse(sortAddressesForList(getMockAddresses())) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.USER.ADDRESS_DEFAULT) {
    const def = getMockAddresses().find(a => a.isDefault);
    if (def) return toResponse(def) as T;
    if (getMockAddresses().length > 0) {
      return toResponse({ ...getMockAddresses()[0], isDefault: true }) as T;
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
    const found = getMockAddresses().find(a => a.id === id);
    if (!found) return undefined;
    return toResponse(found) as T;
  }

  if (method === 'post' && cleanUrl === addrBase) {
    const payload = asRecord(data);
    const now = new Date().toISOString();
    const isFirst = getMockAddresses().length === 0;
    const wantsDefault = payload.isDefault === true || isFirst;

    let list = getMockAddresses().map(a => ({ ...a }));
    if (wantsDefault) {
      list = list.map(a => ({ ...a, isDefault: false }));
    }

    const newAddr = {
      id: `addr-${getMockAddresses().length + 1}-${Date.now()}`,
      fullName: String(payload.fullName || getMockUser().fullName),
      phone: String(payload.phone || getMockUser().phone || '0900000000'),
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

    setMockAddresses(sortAddressesForList([...list, newAddr]));
    const created = getMockAddresses().find(a => a.id === newAddr.id);
    return toResponse(created || newAddr) as T;
  }

  if (method === 'put' && cleanUrl.startsWith(`${addrBase}/`) && cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1).replace(/\/default$/, '');
    if (!id) return undefined;
    const idx = getMockAddresses().findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    setMockAddresses(
      sortAddressesForList(
        getMockAddresses().map(a =>
          a.id === id ? { ...a, isDefault: true, updatedAt: now } : { ...a, isDefault: false }
        )
      )
    );
    const updated = getMockAddresses().find(a => a.id === id);
    if (updated) return toResponse(updated) as T;
  }

  if (method === 'put' && cleanUrl.startsWith(`${addrBase}/`) && !cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1);
    if (!id || id.includes('/')) return undefined;
    const payload = asRecord(data);
    const now = new Date().toISOString();
    let list = getMockAddresses().map(a => ({ ...a }));
    if (payload.isDefault === true) {
      list = list.map(a => ({ ...a, isDefault: false }));
    }
    setMockAddresses(
      sortAddressesForList(
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
      )
    );
    const updated = getMockAddresses().find(a => a.id === id);
    if (updated) return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith(`${addrBase}/`) && !cleanUrl.endsWith('/default')) {
    const id = cleanUrl.slice(addrBase.length + 1);
    if (!id || id.includes('/')) return undefined;
    const removed = getMockAddresses().find(a => a.id === id);
    if (!removed) return undefined;
    const wasDefault = removed.isDefault;
    setMockAddresses(getMockAddresses().filter(a => a.id !== id));
    if (wasDefault && getMockAddresses().length > 0) {
      const pickId = getMockAddresses()[0].id;
      setMockAddresses(
        sortAddressesForList(getMockAddresses().map(a => ({ ...a, isDefault: a.id === pickId })))
      );
    }
    return toResponse(null) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.LIST) {
    return toResponse(getMockCategories()) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.ACTIVE) {
    return toResponse(getMockCategories().filter((category) => category.active !== false)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.BRANDS.LIST) {
    return toResponse(getMockBrands()) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.BRANDS.ACTIVE) {
    return toResponse(getMockBrands().filter((brand) => brand.active)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.FEATURED) {
    const featuredProducts = getMockProducts().filter(product => product.featured);
    const page = toNumber(params.page, 0);
    const size = toNumber(params.size, 10);
    return toPaginatedListResponse(toPage(featuredProducts, page, size)) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.SEARCH) {
    const keyword = String(params.keyword || '').toLowerCase();
    const minPrice = toNumber(params.minPrice, 0);
    const maxPrice = toNumber(params.maxPrice, Number.MAX_SAFE_INTEGER);
    const filtered = getMockProducts().filter(product => {
      const nameMatch =
        keyword.length === 0 ||
        product.name.toLowerCase().includes(keyword) ||
        product.slug.toLowerCase().includes(keyword);
      const price = product.salePrice || product.price;
      return nameMatch && price >= minPrice && price <= maxPrice;
    });

    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.LIST) {
    let filtered = [...getMockProducts()];

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
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.PUBLISHED) {
    const filtered = getMockProducts().filter(product => product.status === 'PUBLISHED');
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.PRODUCTS.PRICE_RANGE) {
    const min = toNumber(params.minPrice, 0);
    const max = toNumber(params.maxPrice, Number.MAX_SAFE_INTEGER);
    const filtered = getMockProducts().filter(product => {
      const price = product.salePrice || product.price;
      return price >= min && price <= max;
    });
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/category/')) {
    const categoryId = cleanUrl.replace('/products/category/', '');
    const filtered = getMockProducts().filter(product => product.category?.id === categoryId);
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/brand/')) {
    const brandId = cleanUrl.replace('/products/brand/', '');
    const filtered = getMockProducts().filter(product => product.brand?.id === brandId);
    return toPaginatedListResponse(
      toPage(filtered, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/products/slug/')) {
    const slug = cleanUrl.replace('/products/slug/', '');
    const product = getMockProducts().find(item => item.slug === slug) || getMockProducts()[0];
    return toResponse(product) as T;
  }

  if (
    method === 'get' &&
    cleanUrl.startsWith('/products/') &&
    !cleanUrl.includes('/images/upload') &&
    cleanUrl !== API_ENDPOINTS.PRODUCTS.PUBLISHED &&
    cleanUrl !== API_ENDPOINTS.PRODUCTS.PRICE_RANGE &&
    !cleanUrl.startsWith('/products/slug/') &&
    !cleanUrl.startsWith('/products/category/') &&
    !cleanUrl.startsWith('/products/brand/')
  ) {
    const id = cleanUrl.replace('/products/', '');
    const product = getMockProducts().find(item => item.id === id) || getMockProducts()[0];
    return toResponse(product) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CART.ROOT) {
    return toResponse(getMockCart()) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CART.SUMMARY) {
    recalculateMockCart();
    return toResponse({
      totalItems: getMockCart().totalItems,
      subtotal: getMockCart().subtotal,
      discount: getMockCart().discount,
      total: getMockCart().total,
    }) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CART.ITEMS) {
    const payload = asRecord(data);
    const productId = String(payload.productId || MOCK_ADD_TO_CART_REQUEST.productId);
    const quantity = toNumber(payload.quantity, MOCK_ADD_TO_CART_REQUEST.quantity);
    const product = findMockProductById(productId);

    if (product) {
      const cart = getMockCart();
      const existing = cart.items.find(item => item.productId === productId);
      const unitPrice = product.salePrice || product.price;

      if (existing) {
        const items = cart.items.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * unitPrice,
              }
            : item
        );
        setMockCart({ ...cart, items });
      } else {
        const explicitImage =
          typeof payload.productImageUrl === 'string' ? String(payload.productImageUrl) : undefined;
        const inferredImage = product.images?.[0]?.imageUrl || '';
        setMockCart({
          ...cart,
          items: [
            ...cart.items,
            {
              id: `ci-${cart.items.length + 1}-${Date.now()}`,
              productId,
              productName: product.name,
              productImageUrl: explicitImage ?? inferredImage,
              quantity,
              price: unitPrice,
              total: quantity * unitPrice,
              inStock: (product.stockQuantity ?? 0) > 0,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }

      recalculateMockCart();
    }

    return toResponse(getMockCart()) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/cart/items/')) {
    const itemId = cleanUrl.replace('/cart/items/', '');
    const payload = asRecord(data);
    const quantity = toNumber(payload.quantity, MOCK_UPDATE_CART_ITEM_REQUEST.quantity);
    const cart = getMockCart();

    setMockCart({
      ...cart,
      items: cart.items.map(item => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          quantity,
          total: item.price * quantity,
        };
      }),
    });

    recalculateMockCart();
    return toResponse(getMockCart()) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/cart/items/')) {
    const itemId = cleanUrl.replace('/cart/items/', '');
    const cart = getMockCart();
    setMockCart({
      ...cart,
      items: cart.items.filter(item => item.id !== itemId),
    });
    recalculateMockCart();
    return toResponse(getMockCart()) as T;
  }

  if (method === 'delete' && cleanUrl === API_ENDPOINTS.CART.ROOT) {
    setMockCart({
      ...getMockCart(),
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    });
    return undefined;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.ORDERS.ROOT) {
    return toPaginatedListResponse(
      toPage(getMockOrders(), toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.ORDERS.MY_ORDERS) {
    const userId = getMockUser().id;
    const userOrders = getMockOrders().filter(order => order.userId === userId);
    return toPaginatedListResponse(
      toPage(userOrders, toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/orders/number/')) {
    const orderNumber = cleanUrl.replace('/orders/number/', '');
    const order = getMockOrders().find(item => item.orderNumber === orderNumber) || getMockOrders()[0];
    return toResponse(order) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/orders/')) {
    const segment = cleanUrl.replace('/orders/', '').split('/')[0];
    const reservedOrderPaths = new Set(['my-orders', 'number', 'search', 'summary']);
    if (segment && !segment.includes('/') && !reservedOrderPaths.has(segment)) {
      const order = getMockOrders().find(item => item.id === segment) || getMockOrders()[0];
      return toResponse(order) as T;
    }
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.ORDERS.ROOT) {
    if (getMockCart().items.length === 0 && !Array.isArray((asRecord(data)).items)) {
      setMockCart(buildSeedCart());
      recalculateMockCart();
    }

    const payload = asRecord(data);
    const created = createOrderFromCart(payload);
    setMockOrders([created, ...getMockOrders()]);

    return toResponse(created) as T;
  }

  // PUT /orders/{id}/payment-confirmed
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/payment-confirmed$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/payment-confirmed', '');
    const updated = updateMockOrderById(id, {
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
    });
    return toResponse(updated || getMockOrders()[0]) as T;
  }

  // PUT /orders/{id}/delivered
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/delivered$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/delivered', '');
    const updated = updateMockOrderById(id, {
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      shipmentStatus: ShipmentStatus.DELIVERED,
    });
    return toResponse(updated || getMockOrders()[0]) as T;
  }

  // PUT /orders/{id}/confirm
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/confirm$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/confirm', '');
    const updated = updateMockOrderById(id, { status: OrderStatus.CONFIRMED });
    return toResponse(updated || getMockOrders()[0]) as T;
  }

  // PUT /orders/{id}/shipping-status
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/shipping-status$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/shipping-status', '');
    const payload = asRecord(data);
    const shipmentStatus = String(
      payload.status || ShipmentStatus.PENDING,
    ) as ShipmentStatus;
    const updated = updateMockOrderById(id, { shipmentStatus });
    return toResponse(updated || getMockOrders()[0]) as T;
  }

  // PUT /orders/{id}/status (cancel / generic status)
  if (method === 'put' && cleanUrl.match(/^\/orders\/([^/]+)\/status$/)) {
    const id = cleanUrl.replace('/orders/', '').replace('/status', '');
    const payload = asRecord(data);
    const newStatus = String(payload.status || OrderStatus.CANCELLED) as OrderStatus;
    const updated = updateMockOrderById(id, { status: newStatus });
    return toResponse(updated || getMockOrders()[0]) as T;
  }

  // POST /payments/create
  if (method === 'post' && cleanUrl === '/payments/create') {
    const payload = asRecord(data);
    setMockPayment({
      ...MOCK_PAYMENT_INTENT,
      id: Date.now(),
      paymentNumber: `PAY-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`,
      orderId: String(payload.orderId || getMockPayment().orderId),
      orderNumber: String(payload.orderNumber || getMockPayment().orderNumber),
      amount: toNumber(payload.amount, MOCK_CREATE_PAYMENT_REQUEST.amount),
      paymentMethod: (payload.paymentMethod as 'COD' | 'VNPAY') || 'COD',
      paymentUrl:
        payload.paymentMethod === 'VNPAY'
          ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?mock=1'
          : null,
      status: 'PENDING',
    } as PaymentResponse);
    return toResponse(getMockPayment()) as T;
  }

  // PUT /payments/order/{orderNumber}/success
  if (method === 'put' && cleanUrl.match(/^\/payments\/order\/([^/]+)\/success$/)) {
    setMockPayment({ ...getMockPayment(), status: 'PAID', paymentUrl: null });
    return toResponse(getMockPayment()) as T;
  }

  // GET /payments/order/{orderNumber}
  if (method === 'get' && cleanUrl.startsWith('/payments/order/')) {
    return toResponse(getMockPayment()) as T;
  }

  // GET /payments/{id}
  if (method === 'get' && cleanUrl.startsWith('/payments/')) {
    return toResponse(getMockPayment()) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.REVIEWS.ROOT) {
    const payload = asRecord(data);
    const next = {
      id: `rev-${getMockReviews().length + 1}`,
      userName: getMockUser().fullName,
      rating: toNumber(payload.rating, MOCK_CREATE_REVIEW_REQUEST.rating),
      title: String(payload.title || MOCK_CREATE_REVIEW_REQUEST.title),
      comment: String(payload.comment || MOCK_CREATE_REVIEW_REQUEST.comment),
      verified: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };
    setMockReviews([next, ...getMockReviews()]);
    return toResponse(next) as T;
  }

  if (method === 'get' && cleanUrl.includes('/summary') && cleanUrl.startsWith('/reviews/product/')) {
    const totalReviews = getMockReviews().length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              getMockReviews().reduce((sum, review) => sum + review.rating, 0) /
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

    getMockReviews().forEach(review => {
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
      toPage(getMockReviews(), toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'post' && cleanUrl.startsWith('/reviews/') && cleanUrl.endsWith('/vote')) {
    const reviewId = cleanUrl.replace('/reviews/', '').replace('/vote', '');
    const payload = asRecord(data);
    const helpful = payload.helpful !== false;
    if (helpful) {
      setMockReviews(
        getMockReviews().map(review =>
          review.id === reviewId
            ? { ...review, helpfulCount: (review.helpfulCount ?? 0) + 1 }
            : review,
        ),
      );
    }
    return toEmptySuccessResponse() as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.REVIEWS.MY_REVIEWS) {
    const mine = getMockReviews().filter(review => review.userName === getMockUser().fullName);
    return toPaginatedListResponse(
      toPage(mine, toNumber(params.page, 0), toNumber(params.size, 10)),
    ) as T;
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
    mockShipmentState = {
      ...MOCK_SHIPMENT_RESPONSE,
      shipmentId: Date.now(),
      shipmentNumber: `SHIP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0001`,
      orderId: String(payload.orderId || mockShipmentState.orderId),
      orderNumber: String(payload.orderNumber || mockShipmentState.orderNumber),
      shippingFee: toNumber(payload.shippingFee, 30000),
      codAmount: toNumber(payload.codAmount, 0),
      estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return toResponse(mockShipmentState) as T;
  }

  // PUT /shipping/{id}/status
  if (method === 'put' && cleanUrl.match(/^\/shipping\/\d+\/status$/)) {
    const payload = asRecord(data);
    const shipmentId = Number(cleanUrl.replace('/shipping/', '').replace('/status', ''));
    const shipmentStatus = String(
      payload.status || mockShipmentState.status,
    ) as ShipmentStatus;
    mockShipmentState = {
      ...mockShipmentState,
      status: shipmentStatus,
      updatedAt: new Date().toISOString(),
    };
    updateMockOrdersByShipmentId(shipmentId, { shipmentStatus });
    return toResponse(mockShipmentState) as T;
  }

  // PUT /shipping/{id}/deliver
  if (method === 'put' && cleanUrl.match(/^\/shipping\/\d+\/deliver$/)) {
    const shipmentId = Number(cleanUrl.replace('/shipping/', '').replace('/deliver', ''));
    mockShipmentState = {
      ...mockShipmentState,
      status: ShipmentStatus.DELIVERED,
      updatedAt: new Date().toISOString(),
    };
    updateMockOrdersByShipmentId(shipmentId, { shipmentStatus: ShipmentStatus.DELIVERED });
    return toResponse(mockShipmentState) as T;
  }

  // GET /shipping/order/{orderId}
  if (method === 'get' && cleanUrl.startsWith('/shipping/order/')) {
    const orderId = cleanUrl.replace('/shipping/order/', '');
    return toResponse({ ...mockShipmentState, orderId }) as T;
  }

  // GET /shipping/track/{trackingNumber}
  if (method === 'get' && cleanUrl.startsWith('/shipping/track/')) {
    const trackingNumber = cleanUrl.replace('/shipping/track/', '');
    return toResponse({
      ...mockShipmentState,
      shipmentNumber: trackingNumber || mockShipmentState.shipmentNumber,
    }) as T;
  }

  // GET /shipping/{id}
  if (method === 'get' && cleanUrl.match(/^\/shipping\/\d+$/)) {
    return toResponse(mockShipmentState) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.NOTIFICATIONS.MY) {
    return toPaginatedListResponse(
      toPage(getMockNotifications(), toNumber(params.page, 0), toNumber(params.size, 10))
    ) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/notifications/') && cleanUrl.endsWith('/mark-read')) {
    const id = cleanUrl.replace('/notifications/', '').replace('/mark-read', '');
    setMockNotifications(
      getMockNotifications().map(notification =>
        notification.id === id ? { ...notification, status: 'SENT' } : notification,
      ),
    );
    return toEmptySuccessResponse() as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.PRODUCTS.SYNC_ELASTICSEARCH) {
    return undefined;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CATEGORIES.TREE) {
    return toResponse(getMockCategories()) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/slug/')) {
    const slug = cleanUrl.replace('/categories/slug/', '');
    const category = getMockCategories().find((item) => item.slug === slug) || getMockCategories()[0];
    return toResponse(category) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/categories/') && !cleanUrl.endsWith('/tree')) {
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    if (id && id !== 'slug') {
      const category = getMockCategories().find((item) => item.id === id) || getMockCategories()[0];
      return toResponse(category) as T;
    }
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/slug/')) {
    const slug = cleanUrl.replace('/brands/slug/', '');
    const brand = getMockBrands().find((item) => item.slug === slug) || getMockBrands()[0];
    return toResponse(brand) as T;
  }

  if (method === 'get' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    if (id && id !== 'slug') {
      const brand = getMockBrands().find((item) => item.id === id) || getMockBrands()[0];
      return toResponse(brand) as T;
    }
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CATEGORIES.LIST) {
    const payload = asRecord(data);
    const next = {
      id: `c-${getMockCategories().length + 1}`,
      name: String(payload.name || 'New Category'),
      slug: String(payload.slug || `new-category-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      productCount: 0,
      displayOrder: toNumber(payload.displayOrder, getMockCategories().length + 1),
      active: payload.active !== false,
    };
    setMockCategories([next, ...getMockCategories()]);
    return toResponse(next) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.BRANDS.LIST) {
    const payload = asRecord(data);
    const next = {
      id: `b-${getMockBrands().length + 1}`,
      name: String(payload.name || 'New Brand'),
      slug: String(payload.slug || `new-brand-${Date.now()}`),
      description: typeof payload.description === 'string' ? payload.description : undefined,
      active: payload.active !== false,
    };
    setMockBrands([next, ...getMockBrands()]);
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
      ...getMockProducts()[0],
      id: `p-${getMockProducts().length + 1}`,
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
          : getMockProducts()[0].status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMockProducts([next, ...getMockProducts()]);
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

    setMockProducts( getMockProducts().map(product => {
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
    }));

    const updated = getMockProducts().find(product => product.id === id) || getMockProducts()[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/products/')) {
    const id = cleanUrl.replace('/products/', '').split('/')[0];
    if (!id) return undefined;
    setMockProducts(getMockProducts().filter(product => product.id !== id));
    return toEmptySuccessResponse() as T;
  }

  if (method === 'post' && cleanUrl.includes('/images/upload')) {
    const id = cleanUrl.replace('/products/', '').replace('/images/upload', '');
    const product = getMockProducts().find(item => item.id === id) || getMockProducts()[0];
    return toResponse(product) as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/categories/')) {
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    const payload = asRecord(data);
    setMockCategories( getMockCategories().map((category) =>
      category.id === id ? { ...category, ...(payload as Partial<typeof category>) } : category,
    ));
    const updated = getMockCategories().find((category) => category.id === id) || getMockCategories()[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/categories/')) {
    const id = cleanUrl.replace('/categories/', '').split('/')[0];
    if (!id) return undefined;
    setMockCategories(getMockCategories().filter((category) => category.id !== id));
    return toEmptySuccessResponse() as T;
  }

  if (method === 'put' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    const payload = asRecord(data);
    setMockBrands( getMockBrands().map((brand) =>
      brand.id === id ? { ...brand, ...(payload as Partial<typeof brand>) } : brand,
    ));
    const updated = getMockBrands().find((brand) => brand.id === id) || getMockBrands()[0];
    return toResponse(updated) as T;
  }

  if (method === 'delete' && cleanUrl.startsWith('/brands/')) {
    const id = cleanUrl.replace('/brands/', '').split('/')[0];
    if (!id) return undefined;
    setMockBrands(getMockBrands().filter((brand) => brand.id !== id));
    return toEmptySuccessResponse() as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CHAT.CONVERSATIONS_LIST) {
    const conversations = getMockChatConversations().filter(
      conversation => conversation.type === 'SUPPORT' && conversation.claimed,
    );
    return toResponse(conversations) as T;
  }

  if (method === 'get' && cleanUrl === API_ENDPOINTS.CHAT.SUPPORT_QUEUE) {
    const queue = getMockChatConversations().filter(
      conversation => conversation.type === 'SUPPORT' && !conversation.claimed,
    );
    return toResponse(queue) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CHAT.SUPPORT_CONVERSATION) {
    const existing = getMockChatConversations().find(
      conversation =>
        conversation.type === 'SUPPORT' &&
        conversation.supportCustomerUserId === getMockUser().id,
    );
    if (existing) {
      return toResponse(existing) as T;
    }

    const created: ConversationInbound = {
      id: getMockChatConversations().length + 1,
      type: 'SUPPORT',
      supportCustomerUserId: getMockUser().id,
      claimed: false,
      lastMessagePreview: null,
      lastMessageAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participantUserIds: [getMockUser().id],
    };
    setMockChatConversations([created, ...getMockChatConversations()]);
    setMockChatMessages({ ...getMockChatMessages(), [String(created.id)]: [] });
    return toResponse(created) as T;
  }

  const claimConversationMatch = cleanUrl.match(/^\/chat\/conversations\/(\d+)\/claim$/);
  if (method === 'post' && claimConversationMatch) {
    const conversationId = Number(claimConversationMatch[1]);
    setMockChatConversations(
      getMockChatConversations().map(conversation =>
        conversation.id === conversationId
          ? { ...conversation, claimed: true, updatedAt: new Date().toISOString() }
          : conversation,
      ),
    );
    const claimed =
      getMockChatConversations().find(conversation => conversation.id === conversationId) ??
      getMockChatConversations()[0];
    return toResponse(claimed) as T;
  }

  const conversationDetailMatch = cleanUrl.match(/^\/chat\/conversations\/(\d+)$/);
  if (method === 'get' && conversationDetailMatch) {
    const conversationId = Number(conversationDetailMatch[1]);
    const conversation =
      getMockChatConversations().find(item => item.id === conversationId) ??
      getMockChatConversations()[0];
    return toResponse(conversation) as T;
  }

  const conversationMessagesMatch = cleanUrl.match(/^\/chat\/conversations\/(\d+)\/messages$/);
  if (method === 'get' && conversationMessagesMatch) {
    const conversationId = conversationMessagesMatch[1];
    const messages = getMockChatMessages()[conversationId] ?? [];
    const page = toNumber(params.page, 0);
    const size = toNumber(params.size, 10);
    const start = page * size;
    const content = messages.slice(start, start + size);
    return toResponse({
      content,
      page,
      size,
      totalElements: messages.length,
      totalPages: messages.length === 0 ? 0 : Math.ceil(messages.length / size),
      first: page === 0,
      last: start + size >= messages.length,
    }) as T;
  }

  if (method === 'post' && cleanUrl === API_ENDPOINTS.CHAT.SEND_MESSAGE) {
    const payload = asRecord(data);
    const conversationId = toNumber(payload.conversationId, 1);
    const content = String(payload.content || '');
    const created: MessageInbound = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: getMockUser().id,
      content,
      clientMessageId:
        typeof payload.clientMessageId === 'string' ? payload.clientMessageId : null,
      createdAt: new Date().toISOString(),
    };

    const key = String(conversationId);
    const allMessages = getMockChatMessages();
    const thread = allMessages[key] ?? [];
    setMockChatMessages({ ...allMessages, [key]: [...thread, created] });

    setMockChatConversations(
      getMockChatConversations().map(conversation =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessagePreview: content,
              lastMessageAt: created.createdAt,
              updatedAt: created.createdAt ?? new Date().toISOString(),
            }
          : conversation,
      ),
    );

    return toResponse(created) as T;
  }

  return undefined;
};
