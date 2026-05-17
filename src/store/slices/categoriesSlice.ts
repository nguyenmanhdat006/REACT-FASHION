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
  isLoading: boolean;
  error: string | null;
  activeLoading: boolean;
  activeError: string | null;
}

const initialState: CategoriesState = {
  items: [],
  activeItems: [],
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
        state.items = action.payload.data;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch categories';
        state.items = [];
      })
      .addCase(fetchActiveCategoriesThunk.pending, state => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(fetchActiveCategoriesThunk.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeItems = action.payload.data;
      })
      .addCase(fetchActiveCategoriesThunk.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError =
          (action.payload as string) || 'Failed to fetch active categories';
        state.activeItems = [];
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.activeItems = [data, ...state.activeItems];
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(c => c.id !== id);
        state.activeItems = state.activeItems.filter(c => c.id !== id);
      });
  },
});

export default categoriesSlice.reducer;
