import type { Product } from '@/types/product/product';

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
  const fromImages = product.images?.find(img => img.isPrimary)?.imageUrl
    ?? product.images?.[0]?.imageUrl;
  if (fromImages && fromImages.trim() !== '') return fromImages;

  const fromVariant = product.variants?.find(v => v.imageUrl?.trim())?.imageUrl;
  if (fromVariant && fromVariant.trim() !== '') return fromVariant;

  return fallbackUrl;
}

export function collectProductGalleryUrls(product: Product, heroUrl: string): string[] {
  const fromImages = [...(product.images ?? [])]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map(img => img.imageUrl)
    .filter((u): u is string => Boolean(u?.trim()));

  const fromVariants = (product.variants ?? [])
    .map(v => v.imageUrl)
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
    .map(v => v.size?.trim())
    .filter((s): s is string => Boolean(s));

  if (sizes.length === 0) {
    return [...fallback];
  }

  const seen = new Set<string>();
  const out: SizeOption[] = [];
  for (const label of sizes) {
    if (seen.has(label)) continue;
    seen.add(label);
    const v = variants?.find(x => x.size === label);
    const available =
      typeof v?.available === 'boolean'
        ? v.available
        : (v?.stockQuantity ?? 0) > 0 || v?.stockQuantity === undefined;
    out.push({ label, available });
  }
  return out.length > 0 ? out : [...fallback];
}
