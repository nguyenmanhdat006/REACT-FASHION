import type {
  Brand,
  Category,
  Product,
  ProductFilters,
  ProductListParams,
  SearchProductsParams,
} from '@/types/product/product';
import type { ApiResponse, PageMeta } from '@/types/common/common';
import { MOCK_PRODUCTS } from '@/mocks/ecommerce/ecommerceMockData';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c-1', name: 'Women', slug: 'women', productCount: 120, active: true },
  { id: 'c-2', name: 'Men', slug: 'men', productCount: 98, active: true },
  { id: 'c-3', name: 'Shoes', slug: 'shoes', productCount: 76, active: true },
  { id: 'c-4', name: 'Bags', slug: 'bags', productCount: 64, active: true },
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'b-1', name: 'UrbanMuse', slug: 'urbanmuse', active: true },
  { id: 'b-2', name: 'NorthLane', slug: 'northlane', active: true },
  { id: 'b-3', name: 'KicksLab', slug: 'kickslab', active: true },
  { id: 'b-4', name: 'Mellow', slug: 'mellow', active: true },
];

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
  maxPrice: 100,
};
