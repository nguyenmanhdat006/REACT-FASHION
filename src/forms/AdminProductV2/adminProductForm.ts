import { z } from 'zod';

import {
  ProductStatus,
  type CreateProductRequest,
  type Product,
  type ProductImagePayload,
} from '@/types/product/product';

import type { AdminProductV2FormMediaInput, AdminProductV2FormValues } from './types';

const statusToEnum: Record<string, ProductStatus> = {
  draft: ProductStatus.DRAFT,
  published: ProductStatus.PUBLISHED,
  archived: ProductStatus.ARCHIVED,
};

const statusFromEnum: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'draft',
  [ProductStatus.PUBLISHED]: 'published',
  [ProductStatus.ARCHIVED]: 'archived',
  [ProductStatus.OUT_OF_STOCK]: 'draft',
};

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

export function productToAdminProductFormValues(product: Product): AdminProductV2FormValues {
  const compareAt = product.compareAtPrice;
  const price = product.price;
  let discount = '';
  if (compareAt != null && compareAt > price && price > 0) {
    const pct = Math.round((1 - price / compareAt) * 100);
    if (pct > 0 && pct < 100) discount = `${pct}%`;
  }

  return {
    name: product.name?.trim() ?? '',
    status: statusFromEnum[product.status] ?? 'draft',
    brand: product.brand?.id ?? '',
    category: product.category?.id ?? '',
    subcategory: '',
    price: price > 0 ? String(price) : '',
    discount,
    description: product.description?.trim() ?? '',
    shortDescription: product.shortDescription?.trim() ?? '',
    sku: product.sku?.trim() ?? '',
    stockQuantity:
      product.stockQuantity != null ? String(product.stockQuantity) : '',
    visible: product.published ?? true,
    featured: product.featured ?? false,
  };
}

export function productImagesFromProduct(product: Product): {
  imageUrls: string[];
  coverIndex: number;
} {
  const sorted = [...(product.images ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );
  const imageUrls = sorted
    .map(img => img.imageUrl)
    .filter((u): u is string => Boolean(u?.trim()));

  if (imageUrls.length === 0) {
    return { imageUrls: [], coverIndex: 0 };
  }

  const primaryIdx = sorted.findIndex(img => img.isPrimary);
  const coverIndex = primaryIdx >= 0 ? primaryIdx : 0;
  return { imageUrls, coverIndex };
}

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
  media: AdminProductV2FormMediaInput | undefined,
  productName: string
): ProductImagePayload[] | undefined {
  if (!media?.imageUrls?.length) return undefined;
  const urls = media.imageUrls.filter(u => Boolean(u?.trim()));
  if (urls.length === 0) return undefined;

  const ci = Math.min(Math.max(media.coverIndex, 0), urls.length - 1);
  const coverUrl = urls[ci];
  const rest = urls.filter((_, i) => i !== ci);
  const ordered = [coverUrl, ...rest];
  const name = productName.trim() || 'Product';

  return ordered.map((imageUrl, idx) => ({
    imageUrl,
    altText: `${name} — photo ${idx + 1}`,
    isPrimary: idx === 0,
    displayOrder: idx,
  }));
}

export function adminProductFormToCreateRequest(
  values: AdminProductV2FormValues,
  media?: AdminProductV2FormMediaInput
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
