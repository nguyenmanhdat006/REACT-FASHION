const MOCK_STORAGE_PREFIX = 'react-fashion-mock';
const MOCK_STORAGE_VERSION = '5';

export const MOCK_STORAGE_KEYS = {
  VERSION: `${MOCK_STORAGE_PREFIX}:version`,
  USER: `${MOCK_STORAGE_PREFIX}:user`,
  USERS: `${MOCK_STORAGE_PREFIX}:users`,
  ADDRESSES: `${MOCK_STORAGE_PREFIX}:addresses`,
  CATEGORIES: `${MOCK_STORAGE_PREFIX}:categories`,
  BRANDS: `${MOCK_STORAGE_PREFIX}:brands`,
  PRODUCTS: `${MOCK_STORAGE_PREFIX}:products`,
  CART: `${MOCK_STORAGE_PREFIX}:cart`,
  ORDERS: `${MOCK_STORAGE_PREFIX}:orders`,
  PAYMENT: `${MOCK_STORAGE_PREFIX}:payment`,
  REVIEWS: `${MOCK_STORAGE_PREFIX}:reviews`,
  NOTIFICATIONS: `${MOCK_STORAGE_PREFIX}:notifications`,
  CHAT_CONVERSATIONS: `${MOCK_STORAGE_PREFIX}:chat-conversations`,
  CHAT_MESSAGES: `${MOCK_STORAGE_PREFIX}:chat-messages`,
} as const;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const canUseStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readMockStorage = <T>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return clone(fallback);
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return clone(fallback);
    }
    return JSON.parse(raw) as T;
  } catch {
    return clone(fallback);
  }
};

export const writeMockStorage = <T>(key: string, value: T): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode errors in mock mode.
  }
};

export const removeMockStorage = (key: string): void => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // noop
  }
};

export const resetMockStorage = (): void => {
  if (!canUseStorage()) {
    return;
  }

  Object.values(MOCK_STORAGE_KEYS).forEach(removeMockStorage);
};

export const ensureMockStorageVersion = (onReset: () => void): void => {
  if (!canUseStorage()) {
    return;
  }

  const current = window.localStorage.getItem(MOCK_STORAGE_KEYS.VERSION);
  if (current === MOCK_STORAGE_VERSION) {
    return;
  }

  Object.values(MOCK_STORAGE_KEYS).forEach(removeMockStorage);
  window.localStorage.setItem(MOCK_STORAGE_KEYS.VERSION, MOCK_STORAGE_VERSION);
  onReset();
};

export const getOrInitMockStorage = <T>(
  key: string,
  seed: T,
  onInit?: (value: T) => void,
): T => {
  const existing = readMockStorage<T | null>(key, null);
  if (existing !== null) {
    return existing;
  }

  const initial = clone(seed);
  writeMockStorage(key, initial);
  onInit?.(initial);
  return initial;
};

export const updateMockStorage = <T>(key: string, updater: (current: T) => T, seed: T): T => {
  const current = getOrInitMockStorage(key, seed);
  const next = updater(clone(current));
  writeMockStorage(key, next);
  return next;
};
