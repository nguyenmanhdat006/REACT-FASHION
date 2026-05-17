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
  isLoading: boolean;
  error: string | null;
  activeLoading: boolean;
  activeError: string | null;
}

const initialState: BrandsState = {
  items: [],
  activeItems: [],
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
        state.items = action.payload.data;
      })
      .addCase(fetchBrandsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch brands';
        state.items = [];
      })
      .addCase(fetchActiveBrandsThunk.pending, state => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(fetchActiveBrandsThunk.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeItems = action.payload.data;
      })
      .addCase(fetchActiveBrandsThunk.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = (action.payload as string) || 'Failed to fetch active brands';
        state.activeItems = [];
      })
      .addCase(createBrandThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.items = [data, ...state.items];
        state.activeItems = [data, ...state.activeItems];
      })
      .addCase(deleteBrandThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(b => b.id !== id);
        state.activeItems = state.activeItems.filter(b => b.id !== id);
      });
  },
});

export default brandsSlice.reducer;
