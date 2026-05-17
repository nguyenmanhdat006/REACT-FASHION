import { IMAGES } from '@/constants/images';
import type { Product, ProductVariant } from '@/types/product/product';
import { formatProductPriceUsd, getPrimaryProductImageUrl } from '@/utils/product';

import type { AdminProductRow } from './AdminProductList/sections/AdminProductList';

function sizesLabelFromVariants(variants: ProductVariant[] | undefined): string {
  const sizes = (variants ?? [])
    .map(v => v.size?.trim())
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
