import { z } from 'zod';

import type { AdminUserV2FormValues } from './types';

export const adminUserSubmitSchema = z.object({
  roles: z.array(z.string()).min(1, 'Select at least one role'),
});

export const emptyAdminUserFormValues = (): AdminUserV2FormValues => ({
  roles: [],
});
