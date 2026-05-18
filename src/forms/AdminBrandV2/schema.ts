import { z } from 'zod';

import type { AdminBrandV2FormValues } from './types';

const optionalUrl = z
  .string()
  .optional()
  .refine(v => !v?.trim() || /^https?:\/\/.+/i.test(v.trim()), 'Enter a valid URL (http:// or https://)');

export const adminBrandSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  logoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  active: z.boolean(),
});

export const emptyAdminBrandFormValues = (): AdminBrandV2FormValues => ({
  name: '',
  slug: '',
  description: '',
  logoUrl: '',
  websiteUrl: '',
  active: true,
});
