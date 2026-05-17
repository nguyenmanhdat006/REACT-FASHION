import { z } from 'zod';

import { parseMoney } from '@/utils/formFields';

import type { AdminProductV2FormValues } from './types';

export const adminProductSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  status: z.string().trim().min(1, 'Status is required'),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine(v => parseMoney(v) !== null, 'Enter a valid price'),
  discount: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z
    .string()
    .optional()
    .refine(
      v => !v?.trim() || (/^\d+$/.test(v.trim()) && Number.parseInt(v.trim(), 10) >= 0),
      'Stock quantity must be a non-negative whole number'
    ),
  visible: z.boolean(),
  featured: z.boolean(),
});

export const emptyAdminProductFormValues = (): AdminProductV2FormValues => ({
  name: '',
  status: '',
  brand: '',
  category: '',
  subcategory: '',
  price: '',
  discount: '',
  description: '',
  shortDescription: '',
  sku: '',
  stockQuantity: '',
  visible: true,
  featured: false,
});
