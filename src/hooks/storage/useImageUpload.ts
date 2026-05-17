import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useStorage } from '@/hooks/storage/useStorage';

export type UseImageUploadOptions = {
  readOnly?: boolean;
};

export function useImageUpload({ readOnly = false }: UseImageUploadOptions = {}) {
  const { uploadFile, isUploading } = useStorage();
  const [uploadingCount, setUploadingCount] = useState(0);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (readOnly) return null;

      if (!file.type.startsWith('image/')) {
        toast.error('Please choose an image file');
        return null;
      }

      setUploadingCount(c => c + 1);
      try {
        const result = await uploadFile(file);
        return result?.url ?? null;
      } finally {
        setUploadingCount(c => Math.max(0, c - 1));
      }
    },
    [readOnly, uploadFile]
  );

  return {
    uploadImage,
    uploadBusy: isUploading || uploadingCount > 0,
  };
}
