import type { Address, User } from '@/types/auth/auth';
import {
  MOCK_ADMIN_ACCOUNT,
  MOCK_USER_ACCOUNT,
} from '@/mocks/auth/authMockData';

export const MOCK_ADMIN_USERS: User[] = [
  MOCK_ADMIN_ACCOUNT,
  MOCK_USER_ACCOUNT,
  {
    id: 'user-2',
    email: 'anna.shop@example.com',
    fullName: 'Anna Tran',
    phone: '0912345678',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    roles: ['CUSTOMER'],
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const MOCK_USER_PROFILE: User = MOCK_USER_ACCOUNT;

export const MOCK_USER_UPDATE_PAYLOAD: Partial<User> = {
  fullName: 'Demo User Updated',
  phone: '0911002200',
};

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: MOCK_USER_ACCOUNT.fullName,
    phone: MOCK_USER_ACCOUNT.phone ?? '0901111111',
    addressLine1: '123 Le Loi',
    addressLine2: null,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    ward: 'Ben Nghe',
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
