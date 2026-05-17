import type { MouseEvent } from 'react';

export type AdminProductV2FormValues = {
  name: string;
  status: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  discount: string;
  description: string;
  shortDescription: string;
  sku: string;
  stockQuantity: string;
  visible: boolean;
  featured: boolean;
};

export type AdminProductV2FormMediaInput = {
  imageUrls: string[];
  coverIndex: number;
};

export type AdminProductV2UploadIntent =
  | { kind: 'cover' }
  | { kind: 'append' }
  | { kind: 'replace'; index: number };

export type AdminProductV2FormMode = 'create' | 'update' | 'read';

export type AdminProductV2FormMedia = {
  coverUrl: string | null;
  galleryPreview1: string | null;
  galleryPreview2: string | null;
  galleryPreview3: string | null;
  galleryMoreBeyondThirdCount: number;
  uploadBusy: boolean;
  galleryModalOpen: boolean;
  productImages: string[];
  coverIndex: number;
  onOpenGalleryModal: () => void;
  onCloseGalleryModal: () => void;
  onChangeProductImages: (next: string[]) => void;
  onChangeCoverIndex: (index: number) => void;
  onCoverClick: (e: MouseEvent) => void;
  onGalleryCellClick: (which: 0 | 1, e: MouseEvent) => void;
  onDashedPlusClick: () => void;
  onModalUploadFile: (file: File) => Promise<string | null>;
};
