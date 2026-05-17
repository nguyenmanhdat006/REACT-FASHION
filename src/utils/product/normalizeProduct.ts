import type { Product } from '@/types/product/product';

function readOptionalString(
  raw: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
}

/** Normalize product text fields from API (camelCase or snake_case). */
export function normalizeProduct<T extends Product>(product: T): T {
  const raw = product as unknown as Record<string, unknown>;
  return {
    ...product,
    description: readOptionalString(raw, 'description') ?? product.description ?? null,
    shortDescription:
      readOptionalString(raw, 'shortDescription', 'short_description') ??
      product.shortDescription ??
      null,
  };
}
