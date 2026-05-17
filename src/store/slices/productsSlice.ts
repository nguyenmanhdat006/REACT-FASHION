import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createProductThunk,
  deleteProductThunk,
  fetchFeaturedProductsThunk,
  fetchProductByIdThunk,
  fetchProductBySlugThunk,
  fetchProductsThunk,
  fetchV2PublishedProductsThunk,
  updateProductThunk,
} from '@/store/thunks/productThunks';
import type { Product, ProductFilters } from '@/types/product/product';

interface ProductsState {
  items: Product[];
  featured: Product[];
  selectedProduct: Product | null;
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
}

const initialState: ProductsState = {
  items: [],
  featured: [],
  selectedProduct: null,
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
      });
  },
});

export const { setProductFilters, clearSelectedProduct, clearProductDetail } =
  productsSlice.actions;
export default productsSlice.reducer;
