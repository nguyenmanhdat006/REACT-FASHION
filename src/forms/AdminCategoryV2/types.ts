export type AdminCategoryV2FormMode = 'create' | 'update';

export type AdminCategoryV2FormValues = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  displayOrder: string;
  active: boolean;
};
