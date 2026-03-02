import type { PageResponse } from './common';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
  active?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  featured: boolean;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  published?: boolean;
  keyword?: string;
}

export type ProductPage = PageResponse<Product>;
