export type AdminAddProductFormValues = {
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

export type AdminAddProductMediaInput = {
  imageUrls: string[];
  coverIndex: number;
};

/** Where a picked file should be applied (main card upload pipeline). */
export type AdminProductUploadIntent =
  | { kind: 'cover' }
  | { kind: 'append' }
  | { kind: 'replace'; index: number };
