import { z } from 'zod';

import { ProductStatus, type CreateProductRequest } from '@/types/product/product';

import type { AdminAddProductFormValues } from './types';

const statusToEnum: Record<string, ProductStatus> = {
  draft: ProductStatus.DRAFT,
  published: ProductStatus.PUBLISHED,
  archived: ProductStatus.ARCHIVED,
};

export const adminAddProductSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  status: z.string().trim().min(1, 'Status is required'),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((v) => parseMoney(v) !== null, 'Enter a valid price'),
  discount: z.string().optional(),
  description: z.string().optional(),
  visible: z.boolean(),
});

export type AdminAddProductSubmitInput = z.infer<typeof adminAddProductSubmitSchema>;

function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[$€£,\s]/g, '').trim();
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseDiscountPercent(input: string | undefined): number | null {
  if (!input?.trim()) return null;
  const m = input.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0 || n >= 100) return null;
  return n;
}

function slugFromName(name: string): string | undefined {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!s) return undefined;
  return s.slice(0, 220);
}

function optionalUuid(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export function adminAddProductFormToCreateRequest(
  values: AdminAddProductFormValues
): CreateProductRequest {
  const price = parseMoney(values.price) ?? 0;
  const statusKey = values.status.trim().toLowerCase();
  const status = statusToEnum[statusKey] ?? ProductStatus.DRAFT;
  const pct = parseDiscountPercent(values.discount);
  const compareAtPrice =
    pct !== null ? Math.round((price / (1 - pct / 100)) * 100) / 100 : undefined;

  let description = values.description?.trim() ?? '';
  const sub = values.subcategory?.trim();
  if (sub) {
    description = description
      ? `${description}\n\nSubcategory: ${sub}`
      : `Subcategory: ${sub}`;
  }

  return {
    name: values.name.trim(),
    slug: slugFromName(values.name),
    description: description || undefined,
    price,
    compareAtPrice,
    categoryId: optionalUuid(values.category),
    brandId: optionalUuid(values.brand),
    status,
    published: values.visible,
    featured: undefined,
  };
}
