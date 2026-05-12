import type { Address, User } from '@/types/auth/auth';

export const MOCK_USER_PROFILE: User = {
  id: 'user-1',
  email: 'dat@example.com',
  fullName: 'Nguyen Dat',
  phone: '0901234567',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
  roles: ['USER'],
  createdAt: '2026-01-10T08:00:00Z',
};

export const MOCK_USER_UPDATE_PAYLOAD: Partial<User> = {
  fullName: 'Nguyen Dat Updated',
  phone: '0911002200',
};

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Nguyen Dat',
    phone: '0901234567',
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
    fullName: 'Nguyen Dat',
    phone: '0901234567',
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
