import type { SelectOption } from '@/components/FormField';
import { IMAGES } from '@/constants/images';

export const STATUS_OPTIONS: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const BRAND_OPTIONS: SelectOption[] = [
  { value: 'aura', label: 'Aura' },
  { value: 'northwind', label: 'Northwind' },
  { value: 'studio', label: 'Studio' },
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'skincare', label: 'Skincare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'fragrance', label: 'Fragrance' },
];

export const SUBCATEGORY_OPTIONS: SelectOption[] = [
  { value: 'moisturizers', label: 'Moisturizers' },
  { value: 'cleansers', label: 'Cleansers' },
  { value: 'serums', label: 'Serums' },
];

export const COVER_IMAGE = IMAGES.PRODUCT_DEMO_1;
export const GALLERY_IMAGES = [
  IMAGES.PRODUCT_DEMO_2,
  IMAGES.PRODUCT_DEMO_1,
  IMAGES.PRODUCT_DEMO_2,
];
