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

export type AdminProductV2UploadIntent = { kind: 'cover' } | { kind: 'append' };

export type AdminProductV2FormMode = 'create' | 'update' | 'read';

export type AdminProductGalleryPreviews = {
  slot0: string | null;
  slot1: string | null;
  slot2: string | null;
  moreCount: number;
};
