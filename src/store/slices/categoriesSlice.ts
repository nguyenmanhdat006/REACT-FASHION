import { createSlice } from '@reduxjs/toolkit';

import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  fetchCategoryByIdThunk,
  updateCategoryThunk,
} from '@/store/thunks/categoryThunks';
import type { Category } from '@/types/product/product';
import type { PageMeta } from '@/types/common/common';

interface CategoriesState {
  items: Category[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  categoryDetail: Category | null;
  categoryDetailLoading: boolean;
  categoryDetailError: string | null;
}

const initialState: CategoriesState = {
  items: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  categoryDetail: null,
  categoryDetailLoading: false,
  categoryDetailError: null,
};

const applyFetchFulfilled = (
  state: CategoriesState,
  data: Category[] | undefined,
  meta: PageMeta | null | undefined,
) => {
  state.isLoading = false;
  state.error = null;
  state.items = data ?? [];
  if (meta) {
    state.page = meta.page;
    state.size = meta.size;
    state.totalElements = meta.totalElements;
    state.totalPages = meta.totalPages;
  }
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryDetail: state => {
      state.categoryDetail = null;
      state.categoryDetailLoading = false;
      state.categoryDetailError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategoriesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        applyFetchFulfilled(state, data, meta);
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch categories';
        state.items = [];
        state.totalElements = 0;
        state.totalPages = 0;
      })
      .addCase(fetchCategoryByIdThunk.pending, state => {
        state.categoryDetailLoading = true;
        state.categoryDetailError = null;
        state.categoryDetail = null;
      })
      .addCase(fetchCategoryByIdThunk.fulfilled, (state, action) => {
        state.categoryDetailLoading = false;
        state.categoryDetail = action.payload.data;
      })
      .addCase(fetchCategoryByIdThunk.rejected, (state, action) => {
        state.categoryDetailLoading = false;
        state.categoryDetailError =
          (action.payload as string) || 'Failed to fetch category';
        state.categoryDetail = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.totalElements += 1;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const idx = state.items.findIndex(c => c.id === data.id);
        if (idx >= 0) state.items[idx] = data;
        if (state.categoryDetail?.id === data.id) {
          state.categoryDetail = data;
        }
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(c => c.id !== id);
        state.totalElements = Math.max(0, state.totalElements - 1);
        if (state.categoryDetail?.id === id) {
          state.categoryDetail = null;
        }
      });
  },
});

export const { clearCategoryDetail } = categoriesSlice.actions;
export default categoriesSlice.reducer;
