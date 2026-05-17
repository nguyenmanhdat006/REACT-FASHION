import { createSlice } from '@reduxjs/toolkit';

import {
  createBrandThunk,
  deleteBrandThunk,
  fetchActiveBrandsThunk,
  fetchBrandsThunk,
} from '@/store/thunks/brandThunks';
import type { Brand } from '@/types/product/product';

interface BrandsState {
  items: Brand[];
  activeItems: Brand[];
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

const initialState: BrandsState = {
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

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBrandsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
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
      .addCase(fetchBrandsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch brands';
        state.items = [];
        state.totalElements = 0;
        state.totalPages = 0;
      })
      .addCase(fetchActiveBrandsThunk.pending, state => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(fetchActiveBrandsThunk.fulfilled, (state, action) => {
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
      .addCase(fetchActiveBrandsThunk.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = (action.payload as string) || 'Failed to fetch active brands';
        state.activeItems = [];
        state.activeTotalElements = 0;
        state.activeTotalPages = 0;
      })
      .addCase(createBrandThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.activeItems = [data, ...state.activeItems];
        state.totalElements += 1;
        state.activeTotalElements += 1;
      })
      .addCase(deleteBrandThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(b => b.id !== id);
        state.activeItems = state.activeItems.filter(b => b.id !== id);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.activeTotalElements = Math.max(0, state.activeTotalElements - 1);
      });
  },
});

export default brandsSlice.reducer;
