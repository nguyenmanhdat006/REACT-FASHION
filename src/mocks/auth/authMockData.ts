import type {
  Address,
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
  User,
} from '@/types/auth/auth';

export const MOCK_DEMO_PASSWORD = '12345678';

export const MOCK_USER_ACCOUNT: User = {
  id: 'user-demo',
  email: 'user@example.com',
  fullName: 'Demo User',
  phone: '0901111111',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  roles: ['CUSTOMER'],
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: '2026-01-10T08:00:00Z',
};

export const MOCK_ADMIN_ACCOUNT: User = {
  id: 'admin-demo',
  email: 'admin@example.com',
  fullName: 'Demo Admin',
  phone: '0902222222',
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
  roles: ['ADMIN'],
  status: 'ACTIVE',
  emailVerified: true,
  createdAt: '2026-01-05T08:00:00Z',
};

export type MockLoginAccount = {
  email: string;
  password: string;
  user: User;
};

export const MOCK_LOGIN_ACCOUNTS: MockLoginAccount[] = [
  {
    email: MOCK_USER_ACCOUNT.email,
    password: MOCK_DEMO_PASSWORD,
    user: MOCK_USER_ACCOUNT,
  },
  {
    email: MOCK_ADMIN_ACCOUNT.email,
    password: MOCK_DEMO_PASSWORD,
    user: MOCK_ADMIN_ACCOUNT,
  },
];

export const findMockLoginAccount = (
  email: string,
  password: string,
): MockLoginAccount | undefined => {
  const normalizedEmail = email.trim().toLowerCase();
  return MOCK_LOGIN_ACCOUNTS.find(
    account =>
      account.email.toLowerCase() === normalizedEmail && account.password === password,
  );
};

/** Default logged-in profile before login (regular user). */
export const MOCK_AUTH_USER: User = MOCK_USER_ACCOUNT;

export const MOCK_USER_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: MOCK_USER_ACCOUNT.fullName,
    phone: MOCK_USER_ACCOUNT.phone ?? '0901111111',
    addressLine1: '123 Le Loi',
    addressLine2: null,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    ward: null,
    postalCode: '700000',
    country: 'Vietnam',
    isDefault: true,
    addressType: 'SHIPPING',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'addr-2',
    fullName: MOCK_USER_ACCOUNT.fullName,
    phone: MOCK_USER_ACCOUNT.phone ?? '0901111111',
    addressLine1: '56 Nguyen Hue',
    addressLine2: null,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    ward: null,
    postalCode: '700000',
    country: 'Vietnam',
    isDefault: false,
    addressType: 'SHIPPING',
    createdAt: '2026-01-09T08:00:00Z',
    updatedAt: '2026-01-09T08:00:00Z',
  },
];

export const MOCK_LOGIN_CREDENTIALS: LoginCredentials = {
  email: MOCK_USER_ACCOUNT.email,
  password: MOCK_DEMO_PASSWORD,
};

export const MOCK_SIGN_UP_CREDENTIALS: SignUpCredentials = {
  email: 'new-user@example.com',
  password: MOCK_DEMO_PASSWORD,
  fullName: 'New User',
  phone: '0909999999',
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
  user: MOCK_USER_ACCOUNT,
};

export const mockAuthFailure = (message: string) => ({
  success: false as const,
  data: null,
  error: message,
  message,
  timestamp: new Date().toISOString(),
});
