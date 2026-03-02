import { createSlice } from '@reduxjs/toolkit';
import type { Address, User } from '@/types/auth';
import {
  fetchAddressesThunk,
  fetchProfileThunk,
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
        state.profile = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch profile';
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export default userSlice.reducer;
