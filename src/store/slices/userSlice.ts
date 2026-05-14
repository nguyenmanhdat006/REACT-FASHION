import { createSlice } from '@reduxjs/toolkit';
import type { Address, User } from '@/types/auth/auth';
import {
  createAddressThunk,
  deleteAddressThunk,
  fetchAddressesThunk,
  fetchProfileThunk,
  setDefaultAddressThunk,
  updateAddressThunk,
  updateProfileThunk,
} from '@/store/thunks/userThunks';

interface UserState {
  profile: User | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfileThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data } = action.payload;
        state.profile = data;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch profile';
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.profile = data;
      })
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.addresses = data;
      })
      .addCase(createAddressThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.addresses = data;
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.addresses = data;
      })
      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.addresses = data;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.addresses = data;
      });
  },
});

export default userSlice.reducer;
