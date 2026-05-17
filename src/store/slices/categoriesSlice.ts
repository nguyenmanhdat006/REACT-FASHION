import { createSlice } from '@reduxjs/toolkit';

import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchActiveCategoriesThunk,
  fetchCategoriesThunk,
} from '@/store/thunks/categoryThunks';
import type { Category } from '@/types/product/product';

interface CategoriesState {
  items: Category[];
  activeItems: Category[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  activePage: number;
  activeSize: number;
  activeTotalElements: number;
  activeTotalPages: number;
  isLoading: boolean;
  error: string | null;
  activeLoading: boolean;
  activeError: string | null;
}

const initialState: CategoriesState = {
  items: [],
  activeItems: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  activePage: 0,
  activeSize: 20,
  activeTotalElements: 0,
  activeTotalPages: 0,
  isLoading: false,
  error: null,
  activeLoading: false,
  activeError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategoriesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { data, meta } = action.payload;
        state.items = data ?? [];
        if (meta) {
          state.page = meta.page;
          state.size = meta.size;
          state.totalElements = meta.totalElements;
          state.totalPages = meta.totalPages;
        }
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch categories';
        state.items = [];
        state.totalElements = 0;
        state.totalPages = 0;
      })
      .addCase(fetchActiveCategoriesThunk.pending, state => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(fetchActiveCategoriesThunk.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeError = null;
        const { data, meta } = action.payload;
        state.activeItems = data ?? [];
        if (meta) {
          state.activePage = meta.page;
          state.activeSize = meta.size;
          state.activeTotalElements = meta.totalElements;
          state.activeTotalPages = meta.totalPages;
        }
      })
      .addCase(fetchActiveCategoriesThunk.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError =
          (action.payload as string) || 'Failed to fetch active categories';
        state.activeItems = [];
        state.activeTotalElements = 0;
        state.activeTotalPages = 0;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.activeItems = [data, ...state.activeItems];
        state.totalElements += 1;
        state.activeTotalElements += 1;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(c => c.id !== id);
        state.activeItems = state.activeItems.filter(c => c.id !== id);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.activeTotalElements = Math.max(0, state.activeTotalElements - 1);
      });
  },
});

export default categoriesSlice.reducer;
