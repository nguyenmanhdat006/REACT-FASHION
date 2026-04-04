import type { PageResponse } from '../common/common';

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
  available?: boolean;
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
  displayOrder?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  active?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  stockQuantity: number;
  sku?: string;
  status: ProductStatus;
  published?: boolean;
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

export interface ProductListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface SearchProductsParams extends ProductListParams {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export interface ProductImagePayload {
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ProductVariantPayload {
  sku: string;
  size?: string;
  color?: string;
  stockQuantity: number;
  priceAdjustment?: number;
  available?: boolean;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  brandId: string;
  status: ProductStatus;
  published?: boolean;
  featured?: boolean;
  stockQuantity: number;
  sku?: string;
  images?: ProductImagePayload[];
  variants?: ProductVariantPayload[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  active?: boolean;
  displayOrder?: number;
}

export type UpdateCategoryRequest = Partial<CategoryPayload>;

export interface BrandPayload {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  active?: boolean;
}

export type UpdateBrandRequest = Partial<BrandPayload>;

export type ProductPage = PageResponse<Product>;
