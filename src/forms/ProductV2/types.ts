export type ProductV2FormValues = {
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

/** @deprecated Use ProductV2FormValues */
export type AdminAddProductFormValues = ProductV2FormValues;

export type ProductV2FormMediaInput = {
  imageUrls: string[];
  coverIndex: number;
};

/** Where a picked file should be applied (main card upload pipeline). */
export type ProductV2UploadIntent =
  | { kind: 'cover' }
  | { kind: 'append' }
  | { kind: 'replace'; index: number };

/** @deprecated Use ProductV2UploadIntent */
export type AdminProductUploadIntent = ProductV2UploadIntent;

/** @deprecated Use ProductV2FormMediaInput */
export type AdminAddProductMediaInput = ProductV2FormMediaInput;

export type ProductV2FormMode = 'create' | 'update' | 'read';
