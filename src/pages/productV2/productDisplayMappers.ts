import { IMAGES } from '@/constants/images';

import type { AdminProductRow } from '@/pages/productV2/AdminProductList/sections/AdminProductList';
import type { ExploreCategoryId, ExploreProductTile } from '@/pages/productV2/ProductV2/productsExploreData';
import type { ProductTile } from '@/pages/productV2/homeDemoData';
import type { Product, ProductVariant } from '@/types/product/product';

export type SizeOption = { label: string; available: boolean };

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatProductPriceUsd(amount: number): string {
  return USD.format(Number.isFinite(amount) ? amount : 0);
}

export function getPrimaryProductImageUrl(product: Product, fallbackUrl: string): string {
  const fromImages = product.images?.find((img) => img.isPrimary)?.imageUrl
    ?? product.images?.[0]?.imageUrl;
  if (fromImages && fromImages.trim() !== '') return fromImages;

  const fromVariant = product.variants?.find((v) => v.imageUrl?.trim())?.imageUrl;
  if (fromVariant && fromVariant.trim() !== '') return fromVariant;

  return fallbackUrl;
}

export function collectProductGalleryUrls(product: Product, heroUrl: string): string[] {
  const fromImages = [...(product.images ?? [])]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((img) => img.imageUrl)
    .filter((u): u is string => Boolean(u?.trim()));

  const fromVariants = (product.variants ?? [])
    .map((v) => v.imageUrl)
    .filter((u): u is string => Boolean(u?.trim()));

  const merged = [...fromImages, ...fromVariants];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of merged) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }

  if (heroUrl && !unique.includes(heroUrl)) {
    unique.unshift(heroUrl);
  }

  return unique;
}

export function variantsToSizeOptions(
  variants: Product['variants'],
  fallback: readonly SizeOption[]
): SizeOption[] {
  const sizes = (variants ?? [])
    .map((v) => v.size?.trim())
    .filter((s): s is string => Boolean(s));

  if (sizes.length === 0) {
    return [...fallback];
  }

  const seen = new Set<string>();
  const out: SizeOption[] = [];
  for (const label of sizes) {
    if (seen.has(label)) continue;
    seen.add(label);
    const v = variants?.find((x) => x.size === label);
    const available =
      typeof v?.available === 'boolean'
        ? v.available
        : (v?.stockQuantity ?? 0) > 0 || v?.stockQuantity === undefined;
    out.push({ label, available });
  }
  return out.length > 0 ? out : [...fallback];
}

function inferExploreCategory(product: Product): Exclude<ExploreCategoryId, 'all'> {
  const hay = `${product.category?.name ?? ''} ${product.name} ${product.description ?? ''}`.toLowerCase();
  if (
    hay.includes('women') ||
    hay.includes('woman') ||
    hay.includes('ladies') ||
    hay.includes('female')
  ) {
    return 'women';
  }
  if (hay.includes('men') || hay.includes("men's") || hay.includes('male')) {
    return 'men';
  }
  return 'men';
}

export function productToExploreProductTile(product: Product): ExploreProductTile {
  const hero = getPrimaryProductImageUrl(product, IMAGES.PRODUCT_DEMO_1);
  return {
    id: product.id,
    imageUrl: hero,
    title: product.name,
    price: formatProductPriceUsd(product.price),
    category: inferExploreCategory(product),
  };
}

export function productToProductTile(product: Product): ProductTile {
  const hero = getPrimaryProductImageUrl(product, IMAGES.PRODUCT_DEMO_1);
  return {
    id: product.id,
    imageUrl: hero,
    title: product.name,
    price: formatProductPriceUsd(product.price),
  };
}

function sizesLabelFromVariants(variants: ProductVariant[] | undefined): string {
  const sizes = (variants ?? [])
    .map((v) => v.size?.trim())
    .filter((s): s is string => Boolean(s));
  if (sizes.length === 0) return 'Size: —';
  return `Size: ${sizes.join(', ')}`;
}

function categoryLabel(product: Product): string {
  return product.category?.name?.trim() || 'General';
}

export function productToAdminProductRow(product: Product): AdminProductRow {
  return {
    id: product.id,
    name: product.name,
    sizesLabel: sizesLabelFromVariants(product.variants),
    imageUrl: getPrimaryProductImageUrl(product, IMAGES.PRODUCT_DEMO_1),
    priceFormatted: formatProductPriceUsd(product.price),
    stockLeft: product.stockQuantity ?? 0,
    sold: 0,
    category: categoryLabel(product),
  };
}
