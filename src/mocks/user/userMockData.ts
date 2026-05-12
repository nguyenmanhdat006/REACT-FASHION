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
    city: 'Ho Chi Minh City',
    state: 'District 1',
    zipCode: '700000',
    country: 'Vietnam',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Nguyen Dat',
    phone: '0901234567',
    addressLine1: '56 Nguyen Hue',
    city: 'Ho Chi Minh City',
    state: 'District 1',
    zipCode: '700000',
    country: 'Vietnam',
    isDefault: false,
  },
];
