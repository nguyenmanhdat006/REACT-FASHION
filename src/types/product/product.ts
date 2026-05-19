import type { ApiResponse, PageMeta } from '../common/common';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductImage {
  id?: string;
  imageUrl: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ProductVariant {
  id?: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  priceAdjustment?: number;
  stockQuantity?: number;
  available?: boolean;
  imageUrl?: string;
  weight?: number;
  barcode?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  parentName?: string | null;
  children?: Category[];
  productCount?: number;
  active?: boolean;
  displayOrder?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  active?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  salePrice?: number;
  stockQuantity?: number | null;
  sku?: string | null;
  status: ProductStatus;
  published?: boolean | null;
  featured?: boolean | null;
  category?: Category | null;
  brand?: Brand | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
}

export interface ProductDocument {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: number | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  brandId?: string | null;
  brandName?: string | null;
  brandSlug?: string | null;
  status?: string | null;
  published?: boolean | null;
  featured?: boolean | null;
  stockQuantity?: number | null;
  sku?: string | null;
  imageUrls?: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
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
  status?: ProductStatus;
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
  material?: string;
  style?: string;
  stockQuantity?: number;
  priceAdjustment?: number;
  imageUrl?: string;
  weight?: number;
  barcode?: string;
  available?: boolean;
}

export interface CreateProductRequest {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
  published?: boolean;
  featured?: boolean;
  stockQuantity?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  dimensionUnit?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
  websiteUrl?: string;
  active?: boolean;
}

export type UpdateBrandRequest = Partial<BrandPayload>;

/** Paginated catalog list as returned by the API (`ApiResponse` + `PageMeta`). */
export type ProductPage = ApiResponse<Product[], PageMeta>;
