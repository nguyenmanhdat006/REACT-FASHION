import { IMAGES } from '@/constants/images';
import type { User } from '@/types/auth/auth';
import { formatDateTime } from '@/utils/date';

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roles: string[];
  rolesLabel: string;
  status: string;
  statusLabel: string;
  joinedAtFormatted: string;
  emailVerified: boolean;
};

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map(part => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

export function userToAdminUserRow(user: User): AdminUserRow {
  return {
    id: user.id,
    fullName: user.fullName?.trim() || '—',
    email: user.email?.trim() || '—',
    phone: user.phone?.trim() || '—',
    avatarUrl:
      (user.avatarUrl?.trim() && user.avatarUrl) || IMAGES.PRODUCT_DEMO_1,
    roles: [...(user.roles ?? [])],
    rolesLabel: (user.roles ?? []).join(', ') || '—',
    status: user.status?.trim() || 'ACTIVE',
    statusLabel: formatEnumLabel(user.status?.trim() || 'ACTIVE'),
    joinedAtFormatted: formatDateTime(user.createdAt),
    emailVerified: Boolean(user.emailVerified),
  };
}
