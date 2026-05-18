import { z } from 'zod';

import { ADMIN_CATEGORY_NO_PARENT } from './constants';
import type { AdminCategoryV2FormValues } from './types';

export const adminCategorySubmitSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  displayOrder: z
    .string()
    .optional()
    .refine(
      v => !v?.trim() || (/^\d+$/.test(v.trim()) && Number.parseInt(v.trim(), 10) >= 0),
      'Display order must be a non-negative whole number',
    ),
  active: z.boolean(),
});

export const emptyAdminCategoryFormValues = (): AdminCategoryV2FormValues => ({
  name: '',
  slug: '',
  description: '',
  parentId: ADMIN_CATEGORY_NO_PARENT,
  displayOrder: '0',
  active: true,
});
