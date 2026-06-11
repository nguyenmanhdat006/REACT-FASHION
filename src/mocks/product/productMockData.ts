import type {
  Brand,
  Category,
  Product,
  ProductFilters,
  ProductListParams,
  SearchProductsParams,
} from '@/types/product/product';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
} from '@/mocks/product/productSeedData';

export { MOCK_CATEGORIES, MOCK_BRANDS, MOCK_PRODUCTS };

export const MOCK_PRODUCTS_DATA: Product[] = MOCK_PRODUCTS;

export const MOCK_PRODUCTS_PAGE: ApiResponse<Product[], PageMeta> = {
  success: true,
  data: MOCK_PRODUCTS_DATA,
  meta: {
    page: 0,
    size: 20,
    totalElements: MOCK_PRODUCTS_DATA.length,
    totalPages: MOCK_PRODUCTS_DATA.length === 0 ? 0 : 1,
    first: true,
    last: true,
  },
  error: null,
  message: null,
  timestamp: new Date().toISOString(),
};

export const MOCK_PRODUCT_FILTERS: ProductFilters = {
  page: 0,
  size: 20,
  featured: true,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export const MOCK_PRODUCT_LIST_PARAMS: ProductListParams = {
  page: 0,
  size: 8,
  sortBy: 'name',
  sortDirection: 'asc',
};

export const MOCK_SEARCH_PRODUCTS_PARAMS: SearchProductsParams = {
  keyword: 'blazer',
  page: 0,
  size: 10,
  minPrice: 20,
  maxPrice: 200,
};

export type { Brand, Category, Product };
