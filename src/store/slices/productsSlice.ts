import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createBrandThunk,
  deleteBrandThunk,
  fetchBrandsThunk,
} from '@/store/thunks/brandThunks';
import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
} from '@/store/thunks/categoryThunks';
import {
  createProductThunk,
  deleteProductThunk,
  fetchAdminProductMetaThunk,
  fetchFeaturedProductsThunk,
  fetchProductByIdThunk,
  fetchProductBySlugThunk,
  fetchProductsThunk,
  fetchV2PublishedProductsThunk,
  updateProductThunk,
} from '@/store/thunks/productThunks';
import type { Brand, Category, Product, ProductFilters } from '@/types/product/product';

interface ProductsState {
  items: Product[];
  featured: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  brands: Brand[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;

  homePublishedProducts: Product[];
  homeTilesLoading: boolean;
  homeTilesError: string | null;

  explorePublishedProducts: Product[];
  exploreTilesLoading: boolean;
  exploreTilesError: string | null;

  productDetail: Product | null;
  productDetailLoading: boolean;
  productDetailError: string | null;

  activeCategories: Category[];
  activeBrands: Brand[];
  metaLoading: boolean;
  metaError: string | null;

  categoriesLoading: boolean;
  categoriesError: string | null;
  brandsLoading: boolean;
  brandsError: string | null;
}

const initialState: ProductsState = {
  items: [],
  featured: [],
  selectedProduct: null,
  categories: [],
  brands: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  filters: {},
  isLoading: false,
  error: null,

  homePublishedProducts: [],
  homeTilesLoading: false,
  homeTilesError: null,

  explorePublishedProducts: [],
  exploreTilesLoading: false,
  exploreTilesError: null,

  productDetail: null,
  productDetailLoading: false,
  productDetailError: null,

  activeCategories: [],
  activeBrands: [],
  metaLoading: false,
  metaError: null,

  categoriesLoading: false,
  categoriesError: null,
  brandsLoading: false,
  brandsError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedProduct: state => {
      state.selectedProduct = null;
    },
    clearProductDetail: state => {
      state.productDetail = null;
      state.productDetailLoading = false;
      state.productDetailError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { data, meta } = action.payload;
        state.items = data;
        if (meta) {
          state.page = meta.page;
          state.size = meta.size;
          state.totalElements = meta.totalElements;
          state.totalPages = meta.totalPages;
        }
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch products';
        state.items = [];
        state.totalElements = 0;
        state.totalPages = 0;
      })
      .addCase(fetchFeaturedProductsThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.featured = data;
      })
      .addCase(fetchProductBySlugThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlugThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data } = action.payload;
        state.selectedProduct = data;
      })
      .addCase(fetchProductBySlugThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch product';
      })
      .addCase(fetchCategoriesThunk.pending, state => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        const { data } = action.payload;
        state.categories = data;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError =
          (action.payload as string) || 'Failed to fetch categories';
      })
      .addCase(fetchBrandsThunk.pending, state => {
        state.brandsLoading = true;
        state.brandsError = null;
      })
      .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
        state.brandsLoading = false;
        const { data } = action.payload;
        state.brands = data;
      })
      .addCase(fetchBrandsThunk.rejected, (state, action) => {
        state.brandsLoading = false;
        state.brandsError = (action.payload as string) || 'Failed to fetch brands';
      })
      .addCase(fetchV2PublishedProductsThunk.pending, (state, action) => {
        if (action.meta.arg.scope === 'home') {
          state.homeTilesLoading = true;
          state.homeTilesError = null;
        } else {
          state.exploreTilesLoading = true;
          state.exploreTilesError = null;
        }
      })
      .addCase(fetchV2PublishedProductsThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (action.meta.arg.scope === 'home') {
          state.homeTilesLoading = false;
          state.homePublishedProducts = data;
        } else {
          state.exploreTilesLoading = false;
          state.explorePublishedProducts = data;
        }
      })
      .addCase(fetchV2PublishedProductsThunk.rejected, (state, action) => {
        const scope = action.meta.arg.scope;
        const msg = (action.payload as string) || 'Failed to load products';
        if (scope === 'home') {
          state.homeTilesLoading = false;
          state.homeTilesError = msg;
          state.homePublishedProducts = [];
        } else {
          state.exploreTilesLoading = false;
          state.exploreTilesError = msg;
          state.explorePublishedProducts = [];
        }
      })
      .addCase(fetchProductByIdThunk.pending, state => {
        state.productDetailLoading = true;
        state.productDetailError = null;
        state.productDetail = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.productDetailLoading = false;
        const { data } = action.payload;
        state.productDetail = data;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.productDetailLoading = false;
        state.productDetailError = (action.payload as string) || 'Failed to load product';
        state.productDetail = null;
      })
      .addCase(fetchAdminProductMetaThunk.pending, state => {
        state.metaLoading = true;
        state.metaError = null;
      })
      .addCase(fetchAdminProductMetaThunk.fulfilled, (state, action) => {
        state.metaLoading = false;
        const { data } = action.payload;
        state.activeCategories = data.categories;
        state.activeBrands = data.brands;
      })
      .addCase(fetchAdminProductMetaThunk.rejected, (state, action) => {
        state.metaLoading = false;
        state.metaError = (action.payload as string) || 'Failed to load form data';
        state.activeCategories = [];
        state.activeBrands = [];
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const idx = state.items.findIndex(p => p.id === data.id);
        if (idx >= 0) state.items[idx] = data;
        if (state.productDetail?.id === data.id) {
          state.productDetail = data;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(p => p.id !== id);
        state.homePublishedProducts = state.homePublishedProducts.filter(p => p.id !== id);
        state.explorePublishedProducts = state.explorePublishedProducts.filter(p => p.id !== id);
        if (state.productDetail?.id === id) {
          state.productDetail = null;
        }
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.categories = [data, ...state.categories];
        state.activeCategories = [data, ...state.activeCategories];
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.categories = state.categories.filter(c => c.id !== id);
        state.activeCategories = state.activeCategories.filter(c => c.id !== id);
      })
      .addCase(createBrandThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.brands = [data, ...state.brands];
        state.activeBrands = [data, ...state.activeBrands];
      })
      .addCase(deleteBrandThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.brands = state.brands.filter(b => b.id !== id);
        state.activeBrands = state.activeBrands.filter(b => b.id !== id);
      });
  },
});

export const { setProductFilters, clearSelectedProduct, clearProductDetail } =
  productsSlice.actions;
export default productsSlice.reducer;
