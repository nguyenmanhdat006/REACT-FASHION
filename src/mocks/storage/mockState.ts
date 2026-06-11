import type { Address, User } from '@/types/auth/auth';
import type { Cart } from '@/types/cart/cart';
import { CartStatus } from '@/types/cart/cart';
import type { NotificationItem } from '@/services/notification/notificationService';
import type { PaymentResponse } from '@/types/payment/payment';
import type { Order } from '@/types/order/order';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order/order';
import type { Brand, Category, Product } from '@/types/product/product';
import type { Review } from '@/types/review/review';
import type { ConversationInbound, MessageInbound } from '@/types/chat/chat';
import { MOCK_AUTH_USER } from '@/mocks/auth/authMockData';
import {
  findMockProductImageUrl,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
} from '@/mocks/product/productSeedData';
import { MOCK_ADMIN_USERS, MOCK_ADDRESSES } from '@/mocks/user/userMockData';
import { MOCK_PAYMENT_RESPONSE } from '@/mocks/payment/paymentMockData';
import {
  ensureMockStorageVersion,
  getOrInitMockStorage,
  MOCK_STORAGE_KEYS,
  readMockStorage,
  updateMockStorage,
  writeMockStorage,
} from '@/mocks/storage/mockStorage';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const buildSeedCart = (): Cart => ({
  id: 'cart-1',
  userId: MOCK_AUTH_USER.id,
  status: CartStatus.ACTIVE,
  items: [
    {
      id: 'ci-1',
      productId: 'p-11',
      productName: 'Minimalist Black Coach Jacket',
      productImageUrl: findMockProductImageUrl('p-11'),
      quantity: 1,
      price: 62,
      total: 62,
      inStock: true,
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'ci-2',
      productId: 'p-4',
      productName: 'HopHo Cropped Varsity Sweatshirt',
      productImageUrl: findMockProductImageUrl('p-4'),
      quantity: 2,
      price: 45,
      total: 90,
      inStock: true,
      createdAt: '2026-03-01T10:10:00Z',
    },
  ],
  totalItems: 3,
  subtotal: 152,
  discount: 15,
  total: 137,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:10:00Z',
});

export const buildSeedOrders = (): Order[] => [
  {
    id: 'o-1',
    orderNumber: 'ORD-20260302-0001',
    userId: MOCK_AUTH_USER.id,
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.VNPAY,
    paymentUrl: null,
    shipmentId: 1,
    items: [
      {
        id: 'oi-1',
        productId: 'p-2',
        productName: 'White Essential Street Set',
        productImageUrl: findMockProductImageUrl('p-2'),
        quantity: 1,
        price: 54,
        subtotal: 54,
      },
      {
        id: 'oi-2',
        productId: 'p-6',
        productName: 'Distressed Oversized Denim Jacket',
        productImageUrl: findMockProductImageUrl('p-6'),
        quantity: 1,
        price: 74,
        subtotal: 74,
      },
    ],
    subtotal: 128,
    discount: 10,
    shipping: 30,
    tax: 13,
    total: 161,
    shippingAddress: {
      recipientName: MOCK_AUTH_USER.fullName,
      phone: MOCK_AUTH_USER.phone ?? '0901111111',
      address: '123 Le Loi, Q1',
      city: 'Ho Chi Minh',
      province: 'Ho Chi Minh',
      zipCode: '700000',
    },
    customerName: MOCK_AUTH_USER.fullName,
    customerEmail: MOCK_AUTH_USER.email,
    customerPhone: MOCK_AUTH_USER.phone ?? '0901111111',
    orderedAt: '2026-03-01T09:00:00Z',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'o-2',
    orderNumber: 'ORD-20260302-0002',
    userId: MOCK_AUTH_USER.id,
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.COD,
    paymentUrl: null,
    shipmentId: 2,
    items: [
      {
        id: 'oi-3',
        productId: 'p-17',
        productName: 'Full Denim Canadian Tuxedo',
        productImageUrl: findMockProductImageUrl('p-17'),
        quantity: 1,
        price: 94,
        subtotal: 94,
      },
    ],
    subtotal: 94,
    discount: 0,
    shipping: 30,
    tax: 9,
    total: 133,
    shippingAddress: {
      recipientName: MOCK_AUTH_USER.fullName,
      phone: MOCK_AUTH_USER.phone ?? '0901111111',
      address: '456 Nguyen Hue, Q1',
      city: 'Ho Chi Minh',
      province: 'Ho Chi Minh',
      zipCode: '700000',
    },
    customerName: MOCK_AUTH_USER.fullName,
    customerEmail: MOCK_AUTH_USER.email,
    customerPhone: MOCK_AUTH_USER.phone ?? '0901111111',
    orderedAt: '2026-02-25T08:00:00Z',
    createdAt: '2026-02-25T08:00:00Z',
    updatedAt: '2026-02-25T08:00:00Z',
  },
];

export const buildSeedReviews = (): Review[] => [
  {
    id: 'rev-1',
    userName: 'Le Thanh',
    rating: 5,
    title: 'Exactly like the photos',
    comment: 'The Minimalist Black Coach Jacket fits perfectly and the fabric quality is great.',
    verified: true,
    helpfulCount: 12,
    createdAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'rev-2',
    userName: 'Tran Minh',
    rating: 4,
    title: 'Love the varsity sweatshirt',
    comment: 'HopHo sweatshirt runs slightly cropped — size up if you want more length.',
    verified: true,
    helpfulCount: 5,
    createdAt: '2026-03-11T09:00:00Z',
  },
  {
    id: 'rev-3',
    userName: 'Anna Tran',
    rating: 5,
    title: 'Premium power suit',
    comment: 'The burgundy editorial suit looks stunning in person. Worth every penny.',
    verified: true,
    helpfulCount: 8,
    createdAt: '2026-03-12T10:00:00Z',
  },
];

export const buildSeedNotifications = (): NotificationItem[] => [
  {
    id: 'noti-1',
    type: 'ORDER_CONFIRMED',
    subject: 'Your order ORD-20260302-0001 has been confirmed.',
    status: 'SENT',
    sentAt: '2026-03-01T09:02:00Z',
    createdAt: '2026-03-01T09:01:30Z',
  },
  {
    id: 'noti-2',
    type: 'ORDER_SHIPPED',
    subject: 'Your order ORD-20260302-0001 is now in transit.',
    status: 'SENT',
    sentAt: '2026-03-02T08:00:00Z',
    createdAt: '2026-03-02T07:59:00Z',
  },
  {
    id: 'noti-3',
    type: 'ORDER_DELIVERED',
    subject: 'Your order ORD-20260302-0002 has been delivered.',
    status: 'FAILED',
    sentAt: '2026-03-03T14:00:00Z',
    createdAt: '2026-03-03T13:58:00Z',
  },
];

export const buildSeedChatConversations = (): ConversationInbound[] => [
  {
    id: 1,
    type: 'SUPPORT',
    supportCustomerUserId: MOCK_AUTH_USER.id,
    claimed: false,
    lastMessagePreview: 'Could you share the size chart for the burgundy suit?',
    lastMessageAt: '2026-03-08T08:05:00Z',
    createdAt: '2026-03-08T08:00:00Z',
    updatedAt: '2026-03-08T08:05:00Z',
    participantUserIds: [MOCK_AUTH_USER.id],
  },
];

export const buildSeedChatMessages = (): Record<string, MessageInbound[]> => ({
  '1': [
    {
      id: 'msg-1',
      conversationId: 1,
      senderId: MOCK_AUTH_USER.id,
      content: 'Could you share the size chart for the burgundy suit?',
      clientMessageId: null,
      createdAt: '2026-03-08T08:05:00Z',
    },
  ],
});

const seedUserProfile = (): User => ({
  ...MOCK_AUTH_USER,
  roles: ['CUSTOMER'],
});

/** Re-apply stored profile fields after login so edits survive re-auth. */
export const mergeStoredMockUser = (base: User): User => {
  const stored = readMockStorage<User | null>(MOCK_STORAGE_KEYS.USER, null);
  if (!stored || stored.id !== base.id) {
    return base;
  }

  return {
    ...base,
    fullName: stored.fullName || base.fullName,
    phone: stored.phone ?? base.phone,
    avatarUrl: stored.avatarUrl ?? base.avatarUrl,
    updatedAt: stored.updatedAt ?? base.updatedAt,
  };
};

export const updateMockUserProfile = (payload: Partial<User>): User => {
  const current = getMockUser();
  const legacyAvatar = (payload as { avatar?: string | null }).avatar;

  const next: User = {
    ...current,
    ...(typeof payload.fullName === 'string' ? { fullName: payload.fullName.trim() } : {}),
    ...(payload.phone !== undefined
      ? { phone: typeof payload.phone === 'string' ? payload.phone.trim() || null : payload.phone }
      : {}),
    ...(payload.avatarUrl !== undefined || legacyAvatar !== undefined
      ? { avatarUrl: payload.avatarUrl ?? legacyAvatar ?? current.avatarUrl ?? null }
      : {}),
    updatedAt: new Date().toISOString(),
  };

  writeMockStorage(MOCK_STORAGE_KEYS.USER, next);
  setMockUsers(
    getMockUsers().map(user =>
      user.id === next.id
        ? {
            ...user,
            fullName: next.fullName,
            phone: next.phone,
            avatarUrl: next.avatarUrl,
            updatedAt: next.updatedAt,
          }
        : user,
    ),
  );

  return next;
};

const reseedAll = (): void => {
  writeMockStorage(MOCK_STORAGE_KEYS.USER, seedUserProfile());
  writeMockStorage(MOCK_STORAGE_KEYS.USERS, clone(MOCK_ADMIN_USERS));
  writeMockStorage(MOCK_STORAGE_KEYS.ADDRESSES, clone(MOCK_ADDRESSES));
  writeMockStorage(MOCK_STORAGE_KEYS.CATEGORIES, clone(MOCK_CATEGORIES));
  writeMockStorage(MOCK_STORAGE_KEYS.BRANDS, clone(MOCK_BRANDS));
  writeMockStorage(MOCK_STORAGE_KEYS.PRODUCTS, clone(MOCK_PRODUCTS));
  writeMockStorage(MOCK_STORAGE_KEYS.CART, buildSeedCart());
  writeMockStorage(MOCK_STORAGE_KEYS.ORDERS, buildSeedOrders());
  writeMockStorage(MOCK_STORAGE_KEYS.PAYMENT, clone(MOCK_PAYMENT_RESPONSE));
  writeMockStorage(MOCK_STORAGE_KEYS.REVIEWS, buildSeedReviews());
  writeMockStorage(MOCK_STORAGE_KEYS.NOTIFICATIONS, buildSeedNotifications());
  writeMockStorage(MOCK_STORAGE_KEYS.CHAT_CONVERSATIONS, buildSeedChatConversations());
  writeMockStorage(MOCK_STORAGE_KEYS.CHAT_MESSAGES, buildSeedChatMessages());
};

let initialized = false;

export const initMockState = (): void => {
  if (initialized) {
    return;
  }

  ensureMockStorageVersion(reseedAll);

  getOrInitMockStorage(MOCK_STORAGE_KEYS.USER, seedUserProfile());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.USERS, clone(MOCK_ADMIN_USERS));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.ADDRESSES, clone(MOCK_ADDRESSES));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CATEGORIES, clone(MOCK_CATEGORIES));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.BRANDS, clone(MOCK_BRANDS));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.PRODUCTS, clone(MOCK_PRODUCTS));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CART, buildSeedCart());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.ORDERS, buildSeedOrders());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.PAYMENT, clone(MOCK_PAYMENT_RESPONSE));
  getOrInitMockStorage(MOCK_STORAGE_KEYS.REVIEWS, buildSeedReviews());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.NOTIFICATIONS, buildSeedNotifications());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CHAT_CONVERSATIONS, buildSeedChatConversations());
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CHAT_MESSAGES, buildSeedChatMessages());

  initialized = true;
};

export const resetMockState = (): void => {
  reseedAll();
};

export const getMockUser = (): User =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.USER, seedUserProfile());

export const setMockUser = (user: User): User => {
  writeMockStorage(MOCK_STORAGE_KEYS.USER, user);
  setMockUsers(
    getMockUsers().map(entry =>
      entry.id === user.id
        ? {
            ...entry,
            fullName: user.fullName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            updatedAt: user.updatedAt,
          }
        : entry,
    ),
  );
  return user;
};

export const getMockUsers = (): User[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.USERS, clone(MOCK_ADMIN_USERS));

export const setMockUsers = (users: User[]): User[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.USERS, users);
  return users;
};

export const getMockAddresses = (): Address[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.ADDRESSES, clone(MOCK_ADDRESSES));

export const setMockAddresses = (addresses: Address[]): Address[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.ADDRESSES, addresses);
  return addresses;
};

export const getMockCategories = (): Category[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CATEGORIES, clone(MOCK_CATEGORIES));

export const setMockCategories = (categories: Category[]): Category[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.CATEGORIES, categories);
  return categories;
};

export const getMockBrands = (): Brand[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.BRANDS, clone(MOCK_BRANDS));

export const setMockBrands = (brands: Brand[]): Brand[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.BRANDS, brands);
  return brands;
};

export const getMockProducts = (): Product[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.PRODUCTS, clone(MOCK_PRODUCTS));

export const setMockProducts = (products: Product[]): Product[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.PRODUCTS, products);
  return products;
};

export const getMockCart = (): Cart =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CART, buildSeedCart());

export const setMockCart = (cart: Cart): Cart => {
  writeMockStorage(MOCK_STORAGE_KEYS.CART, cart);
  return cart;
};

export const updateMockCart = (updater: (cart: Cart) => Cart): Cart =>
  updateMockStorage(MOCK_STORAGE_KEYS.CART, updater, buildSeedCart());

export const getMockOrders = (): Order[] => {
  const orders = getOrInitMockStorage(MOCK_STORAGE_KEYS.ORDERS, buildSeedOrders());
  return Array.isArray(orders) ? orders : buildSeedOrders();
};

export const setMockOrders = (orders: Order[]): Order[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.ORDERS, orders);
  return orders;
};

export const getMockPayment = (): PaymentResponse =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.PAYMENT, clone(MOCK_PAYMENT_RESPONSE));

export const setMockPayment = (payment: PaymentResponse): PaymentResponse => {
  writeMockStorage(MOCK_STORAGE_KEYS.PAYMENT, payment);
  return payment;
};

export const getMockReviews = (): Review[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.REVIEWS, buildSeedReviews());

export const setMockReviews = (reviews: Review[]): Review[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.REVIEWS, reviews);
  return reviews;
};

export const getMockNotifications = (): NotificationItem[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.NOTIFICATIONS, buildSeedNotifications());

export const setMockNotifications = (notifications: NotificationItem[]): NotificationItem[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.NOTIFICATIONS, notifications);
  return notifications;
};

export const getMockChatConversations = (): ConversationInbound[] =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CHAT_CONVERSATIONS, buildSeedChatConversations());

export const setMockChatConversations = (
  conversations: ConversationInbound[],
): ConversationInbound[] => {
  writeMockStorage(MOCK_STORAGE_KEYS.CHAT_CONVERSATIONS, conversations);
  return conversations;
};

export const getMockChatMessages = (): Record<string, MessageInbound[]> =>
  getOrInitMockStorage(MOCK_STORAGE_KEYS.CHAT_MESSAGES, buildSeedChatMessages());

export const setMockChatMessages = (
  messages: Record<string, MessageInbound[]>,
): Record<string, MessageInbound[]> => {
  writeMockStorage(MOCK_STORAGE_KEYS.CHAT_MESSAGES, messages);
  return messages;
};

export const findMockProductById = (productId: string): Product | undefined =>
  getMockProducts().find(product => product.id === productId);

export const recalculateMockCart = (): Cart => {
  const cart = getMockCart();
  const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = cart.discount ?? 0;

  return setMockCart({
    ...cart,
    totalItems,
    subtotal,
    total: Math.max(0, subtotal - discount),
    updatedAt: new Date().toISOString(),
  });
};
