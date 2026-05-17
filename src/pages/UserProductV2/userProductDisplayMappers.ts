import { IMAGES } from '@/constants/images';
import type { ProductTile } from '@/pages/HomeV2/homeDemoData';
import {
  formatProductPriceUsd,
  getPrimaryProductImageUrl,
} from '@/utils/product';

import type { ExploreCategoryId, ExploreProductTile } from './UserProductListV2/productsExploreData';
import type { Product } from '@/types/product/product';

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
