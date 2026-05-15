import { z } from 'zod';

import {
  ProductStatus,
  type CreateProductRequest,
  type ProductImagePayload,
} from '@/types/product/product';

import type { AdminAddProductFormValues, AdminAddProductMediaInput } from './types';

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

function trimOrUndefined(value: string | undefined): string | undefined {
  const t = value?.trim();
  return t ? t : undefined;
}

function optionalNonNegativeInt(value: string | undefined): number | undefined {
  const t = value?.trim();
  if (!t) return undefined;
  const n = Number.parseInt(t, 10);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

function buildProductImages(
  media: AdminAddProductMediaInput | undefined,
  productName: string
): ProductImagePayload[] | undefined {
  if (!media?.slotUrls?.length) return undefined;
  const filled = media.slotUrls
    .map((url, slot) => ({ url, slot }))
    .filter((x): x is { url: string; slot: number } => Boolean(x.url));
  if (filled.length === 0) return undefined;

  const maxSlot = media.slotUrls.length - 1;
  const coverSlot = Math.min(Math.max(media.coverSlotIndex, 0), maxSlot);
  const coverEntry = filled.find(x => x.slot === coverSlot) ?? filled[0];
  const rest = filled.filter(x => x.slot !== coverEntry.slot).sort((a, b) => a.slot - b.slot);
  const ordered = [coverEntry, ...rest];
  const name = productName.trim() || 'Product';

  return ordered.map((entry, idx) => ({
    imageUrl: entry.url,
    altText: `${name} — photo ${idx + 1}`,
    isPrimary: idx === 0,
    displayOrder: idx,
  }));
}

export function adminAddProductFormToCreateRequest(
  values: AdminAddProductFormValues,
  media?: AdminAddProductMediaInput
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
    shortDescription: trimOrUndefined(values.shortDescription),
    price,
    compareAtPrice,
    categoryId: optionalUuid(values.category),
    brandId: optionalUuid(values.brand),
    status,
    published: values.visible,
    featured: values.featured,
    stockQuantity: optionalNonNegativeInt(values.stockQuantity),
    sku: trimOrUndefined(values.sku),
    images: buildProductImages(media, values.name),
  };
}
