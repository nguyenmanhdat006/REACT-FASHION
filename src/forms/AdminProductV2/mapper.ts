import {
  ProductStatus,
  type CreateProductRequest,
  type Product,
  type ProductImagePayload,
  type UpdateProductRequest,
} from '@/types/product/product';
import {
  optionalNonNegativeInt,
  parseDiscountPercent,
  parseMoney,
  slugFromName,
  trimOrUndefined,
} from '@/utils/formFields';

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

function optionalUuid(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
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

function adminProductFormToPayload(
  values: AdminProductV2FormValues,
  media?: AdminProductV2FormMediaInput
): CreateProductRequest {
  const price = parseMoney(values.price) ?? 0;
  const statusKey = values.status.trim().toLowerCase();
  const status = statusToEnum[statusKey] ?? ProductStatus.DRAFT;
  const pct = parseDiscountPercent(values.discount);
  const compareAtPrice =
    pct !== null ? Math.round((price / (1 - pct / 100)) * 100) / 100 : undefined;

  const description = trimOrUndefined(values.description);
  const shortDescription = trimOrUndefined(values.shortDescription);

  return {
    name: values.name.trim(),
    slug: slugFromName(values.name),
    ...(description ? { description } : {}),
    ...(shortDescription ? { shortDescription } : {}),
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

export function adminProductFormToCreateRequest(
  values: AdminProductV2FormValues,
  media?: AdminProductV2FormMediaInput
): CreateProductRequest {
  return adminProductFormToPayload(values, media);
}

export function adminProductFormToUpdateRequest(
  values: AdminProductV2FormValues,
  media?: AdminProductV2FormMediaInput
): UpdateProductRequest {
  return adminProductFormToPayload(values, media);
}
