import { createSlice } from '@reduxjs/toolkit';

import {
  createBrandThunk,
  deleteBrandThunk,
  fetchBrandByIdThunk,
  fetchBrandsThunk,
  updateBrandThunk,
} from '@/store/thunks/brandThunks';
import type { Brand } from '@/types/product/product';
import type { PageMeta } from '@/types/common/common';

interface BrandsState {
  items: Brand[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  brandDetail: Brand | null;
  brandDetailLoading: boolean;
  brandDetailError: string | null;
}

const initialState: BrandsState = {
  items: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  brandDetail: null,
  brandDetailLoading: false,
  brandDetailError: null,
};

const applyFetchFulfilled = (
  state: BrandsState,
  data: Brand[] | undefined,
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

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearBrandDetail: state => {
      state.brandDetail = null;
      state.brandDetailLoading = false;
      state.brandDetailError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBrandsThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        applyFetchFulfilled(state, data, meta);
      })
      .addCase(fetchBrandsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch brands';
        state.items = [];
        state.totalElements = 0;
        state.totalPages = 0;
      })
      .addCase(fetchBrandByIdThunk.pending, state => {
        state.brandDetailLoading = true;
        state.brandDetailError = null;
        state.brandDetail = null;
      })
      .addCase(fetchBrandByIdThunk.fulfilled, (state, action) => {
        state.brandDetailLoading = false;
        state.brandDetail = action.payload.data;
      })
      .addCase(fetchBrandByIdThunk.rejected, (state, action) => {
        state.brandDetailLoading = false;
        state.brandDetailError = (action.payload as string) || 'Failed to fetch brand';
        state.brandDetail = null;
      })
      .addCase(createBrandThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.totalElements += 1;
      })
      .addCase(updateBrandThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const idx = state.items.findIndex(b => b.id === data.id);
        if (idx >= 0) state.items[idx] = data;
        if (state.brandDetail?.id === data.id) {
          state.brandDetail = data;
        }
      })
      .addCase(deleteBrandThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(b => b.id !== id);
        state.totalElements = Math.max(0, state.totalElements - 1);
        if (state.brandDetail?.id === id) {
          state.brandDetail = null;
        }
      });
  },
});

export const { clearBrandDetail } = brandsSlice.actions;
export default brandsSlice.reducer;
