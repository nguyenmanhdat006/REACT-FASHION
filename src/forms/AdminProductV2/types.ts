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

/** @deprecated Use AdminProductV2FormValues */
export type ProductV2FormValues = AdminProductV2FormValues;

/** @deprecated Use AdminProductV2FormValues */
export type AdminAddProductFormValues = AdminProductV2FormValues;

export type AdminProductV2FormMediaInput = {
  imageUrls: string[];
  coverIndex: number;
};

/** @deprecated Use AdminProductV2FormMediaInput */
export type ProductV2FormMediaInput = AdminProductV2FormMediaInput;

/** @deprecated Use AdminProductV2FormMediaInput */
export type AdminAddProductMediaInput = AdminProductV2FormMediaInput;

/** Where a picked file should be applied (main card upload pipeline). */
export type AdminProductV2UploadIntent =
  | { kind: 'cover' }
  | { kind: 'append' }
  | { kind: 'replace'; index: number };

/** @deprecated Use AdminProductV2UploadIntent */
export type ProductV2UploadIntent = AdminProductV2UploadIntent;

/** @deprecated Use AdminProductV2UploadIntent */
export type AdminProductUploadIntent = AdminProductV2UploadIntent;

export type AdminProductV2FormMode = 'create' | 'update' | 'read';

/** @deprecated Use AdminProductV2FormMode */
export type ProductV2FormMode = AdminProductV2FormMode;

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
