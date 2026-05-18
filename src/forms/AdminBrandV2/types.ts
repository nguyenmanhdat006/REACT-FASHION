export type AdminBrandV2FormMode = 'create' | 'update';

export type AdminBrandV2FormValues = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  active: boolean;
};
