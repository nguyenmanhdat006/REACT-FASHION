import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearStorageUploadError } from '@/store/slices/storageSlice';
import { uploadFileThunk } from '@/store/thunks/storageThunks';
import type { UploadCreatedData } from '@/types/storage/storage';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useStorage() {
  const dispatch = useAppDispatch();
  const { isUploading, uploadError } = useAppSelector(s => s.storage);

  const clearUploadError = useCallback(() => {
    dispatch(clearStorageUploadError());
  }, [dispatch]);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadCreatedData | null> => {
      const result = await dispatch(uploadFileThunk(file));
      if (uploadFileThunk.fulfilled.match(result)) {
        const body = result.payload.data;
        if (body?.url) {
          return {
            fileId: String(body.fileId ?? ''),
            url: body.url,
          };
        }
        toast.error('Upload succeeded but no URL was returned');
        return null;
      }
      toast.error(payloadMessage(result.payload, 'Could not upload file'));
      return null;
    },
    [dispatch]
  );

  return {
    isUploading,
    uploadError,
    clearUploadError,
    uploadFile,
  };
}
