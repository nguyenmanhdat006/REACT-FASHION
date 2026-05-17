import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import toast from 'react-hot-toast';

import { useStorage } from '@/hooks/storage/useStorage';

import type { AdminProductV2UploadIntent } from './types';

export type UseAdminProductFormMediaOptions = {
  readOnly?: boolean;
  initialImageUrls?: string[];
  initialCoverIndex?: number;
};

export type UseAdminProductFormMediaResult = {
  mainFileInputRef: RefObject<HTMLInputElement>;
  onMainFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  productImages: string[];
  setProductImages: (next: string[]) => void;
  coverIndex: number;
  setCoverIndex: (index: number) => void;
  coverUrl: string | null;
  galleryPreview1: string | null;
  galleryPreview2: string | null;
  galleryPreview3: string | null;
  galleryMoreBeyondThirdCount: number;
  galleryModalOpen: boolean;
  onOpenGalleryModal: () => void;
  onCloseGalleryModal: () => void;
  uploadBusy: boolean;
  onCoverClick: (e: MouseEvent) => void;
  onGalleryCellClick: (which: 0 | 1, e: MouseEvent) => void;
  onDashedPlusClick: () => void;
  onModalUploadFile: (file: File) => Promise<string | null>;
};

export function useAdminProductFormMedia({
  readOnly = false,
  initialImageUrls = [],
  initialCoverIndex = 0,
}: UseAdminProductFormMediaOptions = {}): UseAdminProductFormMediaResult {
  const { uploadFile, isUploading } = useStorage();
  const [productImages, setProductImages] = useState<string[]>(initialImageUrls);
  const [coverIndex, setCoverIndex] = useState(initialCoverIndex);
  const [uploadingFile, setUploadingFile] = useState(false);
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

  const otherIndices = useMemo(
    () => productImages.map((_, i) => i).filter(i => i !== coverIndex),
    [productImages, coverIndex]
  );

  const othersUrls = useMemo(
    () => otherIndices.map(i => productImages[i]),
    [otherIndices, productImages]
  );

  const galleryPreview1 = othersUrls[0] ?? null;
  const galleryPreview2 = othersUrls[1] ?? null;
  const galleryPreview3 = othersUrls[2] ?? null;
  const galleryMoreBeyondThirdCount = Math.max(0, othersUrls.length - 3);

  const coverUrl =
    productImages.length > 0
      ? productImages[Math.min(coverIndex, productImages.length - 1)]
      : null;

  const uploadBusy = isUploading || uploadingFile;

  const requestUpload = useCallback((intent: AdminProductV2UploadIntent) => {
    if (readOnly) return;
    uploadIntentRef.current = intent;
    mainFileInputRef.current?.click();
  }, [readOnly]);

  const onMainFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || readOnly) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setUploadingFile(true);
    const result = await uploadFile(file);
    setUploadingFile(false);
    if (!result?.url) return;
    const intent = uploadIntentRef.current;
    if (intent.kind === 'append') {
      setProductImages(prev => [...prev, result.url]);
      return;
    }
    if (intent.kind === 'cover') {
      setProductImages(prev => {
        if (prev.length === 0) return [result.url];
        const next = [...prev];
        next[coverIndex] = result.url;
        return next;
      });
      return;
    }
    setProductImages(prev => {
      const next = [...prev];
      next[intent.index] = result.url;
      return next;
    });
  };

  const handleCoverClick = (e: MouseEvent) => {
    if (readOnly || uploadBusy) return;
    if (e.shiftKey) {
      setCoverIndex(0);
      return;
    }
    requestUpload({ kind: 'cover' });
  };

  const handleGalleryCellClick = (which: 0 | 1, e: MouseEvent) => {
    if (readOnly || uploadBusy) return;
    if (e.shiftKey) {
      const idx = otherIndices[which];
      if (idx !== undefined) setCoverIndex(idx);
      return;
    }
    const idx = otherIndices[which];
    if (idx === undefined) requestUpload({ kind: 'append' });
    else requestUpload({ kind: 'replace', index: idx });
  };

  const handleDashedPlusClick = () => {
    if (!readOnly) requestUpload({ kind: 'append' });
  };

  const modalUploadSingle = useCallback(
    async (file: File): Promise<string | null> => {
      if (readOnly || !file.type.startsWith('image/')) return null;
      setUploadingFile(true);
      const res = await uploadFile(file);
      setUploadingFile(false);
      return res?.url ?? null;
    },
    [readOnly, uploadFile]
  );

  return {
    mainFileInputRef,
    onMainFileChange,
    productImages,
    setProductImages,
    coverIndex,
    setCoverIndex,
    coverUrl,
    galleryPreview1,
    galleryPreview2,
    galleryPreview3,
    galleryMoreBeyondThirdCount,
    galleryModalOpen,
    onOpenGalleryModal: () => setGalleryModalOpen(true),
    onCloseGalleryModal: () => setGalleryModalOpen(false),
    uploadBusy,
    onCoverClick: handleCoverClick,
    onGalleryCellClick: handleGalleryCellClick,
    onDashedPlusClick: handleDashedPlusClick,
    onModalUploadFile: modalUploadSingle,
  };
}
