import { useCallback, useRef, type ChangeEvent } from 'react';

import { useImageUpload } from '@/hooks/storage/useImageUpload';
import type { User } from '@/types/auth/auth';

const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export function useProfileAvatarUpload(
  updateProfile: (body: Partial<User>) => Promise<boolean>,
) {
  const { uploadImage, uploadBusy } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const onAvatarUploadClick = useCallback(() => {
    if (uploadBusy) return;
    fileInputRef.current?.click();
  }, [uploadBusy]);

  const onAvatarFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || uploadBusy) return;

      const url = await uploadImage(file);
      if (!url) return;

      await updateProfile({ avatarUrl: url });
    },
    [uploadBusy, uploadImage, updateProfile],
  );

  return {
    fileInputRef,
    avatarUploadBusy: uploadBusy,
    avatarAccept: AVATAR_ACCEPT,
    onAvatarUploadClick,
    onAvatarFileChange,
  };
}
