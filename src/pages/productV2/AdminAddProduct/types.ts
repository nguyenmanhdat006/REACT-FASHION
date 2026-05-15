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
  slotUrls: (string | null)[];
  coverSlotIndex: number;
};
