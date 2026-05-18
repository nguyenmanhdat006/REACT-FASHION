import type { User } from '@/types/auth/auth';

import type { AdminUserV2FormValues } from './types';

export function userToAdminUserFormValues(user: User): AdminUserV2FormValues {
  return {
    roles: [...(user.roles ?? [])],
  };
}

export function adminUserFormToRolesRequest(values: AdminUserV2FormValues): string[] {
  return values.roles.map(role => role.trim()).filter(Boolean);
}
