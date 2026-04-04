import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Brand, Category, Product, ProductFilters } from '@/types/product/product';
import {
  fetchProductsThunk,
  fetchFeaturedProductsThunk,
  fetchProductBySlugThunk,
  fetchCategoriesThunk,
  fetchBrandsThunk,
} from '@/store/thunks/productThunks';

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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch products';
      })
      .addCase(fetchFeaturedProductsThunk.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchProductBySlugThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlugThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlugThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch product';
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  },
});

export const { setProductFilters, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
