import { createAsyncThunk } from '@reduxjs/toolkit';

import { storageService } from '@/services/storage/storageService';
import type { ApiResponse } from '@/types/common/common';
import type { UploadCreatedData } from '@/types/storage/storage';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { message?: string; error?: string } } })?.response
    ?.data;
  if (data && typeof data.error === 'string' && data.error.trim()) {
    return data.error.trim();
  }
  if (data && typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return fallback;
};

export const uploadFileThunk = createAsyncThunk<
  ApiResponse<UploadCreatedData>,
  File,
  { rejectValue: string }
>('storage/uploadFile', async (file, { rejectWithValue }) => {
  try {
    const res = await storageService.uploadFile(file);
    if (!res.success || res.data === undefined || res.data === null) {
      return rejectWithValue(apiFailureMessage(res));
    }
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to upload file'));
  }
});
