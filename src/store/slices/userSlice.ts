import { createSlice } from '@reduxjs/toolkit';
import type { Address, User } from '@/types/auth/auth';
import {
  createAddressThunk,
  deleteAddressThunk,
  fetchAddressesThunk,
  fetchProfileThunk,
  fetchUserByIdThunk,
  fetchUsersThunk,
  setDefaultAddressThunk,
  updateAddressThunk,
  updateProfileThunk,
  updateUserRolesThunk,
} from '@/store/thunks/userThunks';

interface UserState {
  profile: User | null;
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  listItems: User[];
  listPage: number;
  listSize: number;
  listTotalElements: number;
  listTotalPages: number;
  isListLoading: boolean;
  listError: string | null;
  userDetail: User | null;
  userDetailLoading: boolean;
  userDetailError: string | null;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,
  listItems: [],
  listPage: 0,
  listSize: 10,
  listTotalElements: 0,
  listTotalPages: 0,
  isListLoading: false,
  listError: null,
  userDetail: null,
  userDetailLoading: false,
  userDetailError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserDetail: state => {
      state.userDetail = null;
      state.userDetailLoading = false;
      state.userDetailError = null;
    },
  },
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
      })
      .addCase(fetchUsersThunk.pending, state => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isListLoading = false;
        const { data, meta } = action.payload;
        state.listItems = data;
        if (meta) {
          state.listPage = meta.page;
          state.listSize = meta.size;
          state.listTotalElements = meta.totalElements;
          state.listTotalPages = meta.totalPages;
        }
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = (action.payload as string) || 'Failed to fetch users';
      })
      .addCase(fetchUserByIdThunk.pending, state => {
        state.userDetailLoading = true;
        state.userDetailError = null;
        state.userDetail = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.userDetailLoading = false;
        state.userDetail = action.payload.data;
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.userDetailLoading = false;
        state.userDetailError = (action.payload as string) || 'Failed to fetch user';
        state.userDetail = null;
      })
      .addCase(updateUserRolesThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.listItems = state.listItems.map(user =>
          user.id === data.id ? data : user,
        );
        if (state.userDetail?.id === data.id) {
          state.userDetail = data;
        }
      });
  },
});

export const { clearUserDetail } = userSlice.actions;
export default userSlice.reducer;
