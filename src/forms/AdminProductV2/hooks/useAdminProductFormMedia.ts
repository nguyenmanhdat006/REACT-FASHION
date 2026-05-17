import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';

import { useImageUpload } from '@/hooks/storage/useImageUpload';

import { buildGalleryPreviews, coverIndexAfterRemove } from '../utils/adminProductMedia';
import type { AdminProductGalleryPreviews, AdminProductV2UploadIntent } from '../types';

export type UseAdminProductFormMediaOptions = {
  readOnly?: boolean;
  initialImageUrls?: string[];
  initialCoverIndex?: number;
};

export type UseAdminProductFormMediaResult = {
  mainFileInputRef: RefObject<HTMLInputElement>;
  onMainFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  productImages: string[];
  setProductImages: Dispatch<SetStateAction<string[]>>;
  coverIndex: number;
  setCoverIndex: (index: number) => void;
  coverUrl: string | null;
  galleryPreviews: AdminProductGalleryPreviews;
  galleryModalOpen: boolean;
  onOpenGalleryModal: () => void;
  onCloseGalleryModal: () => void;
  uploadBusy: boolean;
  onCoverClick: () => void;
  onDashedPlusClick: () => void;
  onGalleryPreviewClick: () => void;
  uploadImage: (file: File) => Promise<string | null>;
  removeImageAt: (index: number) => void;
};

export function useAdminProductFormMedia({
  readOnly = false,
  initialImageUrls = [],
  initialCoverIndex = 0,
}: UseAdminProductFormMediaOptions = {}): UseAdminProductFormMediaResult {
  const { uploadImage, uploadBusy } = useImageUpload({ readOnly });
  const [productImages, setProductImages] = useState<string[]>(initialImageUrls);
  const [coverIndex, setCoverIndex] = useState(initialCoverIndex);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null!);
  const uploadIntentRef = useRef<AdminProductV2UploadIntent>({ kind: 'append' });

  useEffect(() => {
    setProductImages(initialImageUrls);
    setCoverIndex(initialCoverIndex);
  }, [initialImageUrls, initialCoverIndex]);

  useEffect(() => {
    setCoverIndex(c => {
      if (productImages.length === 0) return 0;
      return Math.min(c, productImages.length - 1);
    });
  }, [productImages]);

  const galleryPreviews = useMemo(
    () => buildGalleryPreviews(productImages, coverIndex),
    [productImages, coverIndex]
  );

  const coverUrl =
    productImages.length > 0
      ? productImages[Math.min(coverIndex, productImages.length - 1)]
      : null;

  const requestUpload = useCallback(
    (intent: AdminProductV2UploadIntent) => {
      if (readOnly || uploadBusy) return;
      uploadIntentRef.current = intent;
      mainFileInputRef.current?.click();
    },
    [readOnly, uploadBusy]
  );

  const onMainFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || readOnly) return;

      const url = await uploadImage(file);
      if (!url) return;

      const intent = uploadIntentRef.current;
      if (intent.kind === 'append') {
        setProductImages(prev => [...prev, url]);
        return;
      }
      setProductImages(prev => {
        if (prev.length === 0) return [url];
        const next = [...prev];
        next[coverIndex] = url;
        return next;
      });
    },
    [readOnly, uploadImage, coverIndex]
  );

  const removeImageAt = useCallback((index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setCoverIndex(c => coverIndexAfterRemove(c, index));
  }, []);

  const onCoverClick = useCallback(() => {
    requestUpload({ kind: 'cover' });
  }, [requestUpload]);

  const onDashedPlusClick = useCallback(() => {
    requestUpload({ kind: 'append' });
  }, [requestUpload]);

  const onOpenGalleryModal = useCallback(() => {
    if (!readOnly) setGalleryModalOpen(true);
  }, [readOnly]);

  const onCloseGalleryModal = useCallback(() => {
    setGalleryModalOpen(false);
  }, []);

  const onGalleryPreviewClick = useCallback(() => {
    if (readOnly || uploadBusy) return;
    onOpenGalleryModal();
  }, [readOnly, uploadBusy, onOpenGalleryModal]);

  return {
    mainFileInputRef,
    onMainFileChange,
    productImages,
    setProductImages,
    coverIndex,
    setCoverIndex,
    coverUrl,
    galleryPreviews,
    galleryModalOpen,
    onOpenGalleryModal,
    onCloseGalleryModal,
    uploadBusy,
    onCoverClick,
    onDashedPlusClick,
    onGalleryPreviewClick,
    uploadImage,
    removeImageAt,
  };
}
