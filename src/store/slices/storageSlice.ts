import { createSlice } from '@reduxjs/toolkit';

import { uploadFileThunk } from '@/store/thunks/storageThunks';

interface StorageState {
  isUploading: boolean;
  uploadError: string | null;
}

const initialState: StorageState = {
  isUploading: false,
  uploadError: null,
};

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    clearStorageUploadError: state => {
      state.uploadError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(uploadFileThunk.pending, state => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadFileThunk.fulfilled, state => {
        state.isUploading = false;
        state.uploadError = null;
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = (action.payload as string) || 'Upload failed';
      });
  },
});

export const { clearStorageUploadError } = storageSlice.actions;
export default storageSlice.reducer;
