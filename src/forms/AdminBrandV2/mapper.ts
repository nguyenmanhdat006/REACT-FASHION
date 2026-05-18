import type { Brand, BrandPayload, UpdateBrandRequest } from '@/types/product/product';
import { slugFromName, trimOrUndefined } from '@/utils/formFields';

import type { AdminBrandV2FormValues } from './types';

export function brandToAdminBrandFormValues(brand: Brand): AdminBrandV2FormValues {
  return {
    name: brand.name?.trim() ?? '',
    slug: brand.slug?.trim() ?? '',
    description: brand.description?.trim() ?? '',
    logoUrl: brand.logoUrl?.trim() ?? '',
    websiteUrl: brand.websiteUrl?.trim() ?? '',
    active: brand.active !== false,
  };
}

export function adminBrandFormToCreateRequest(values: AdminBrandV2FormValues): BrandPayload {
  const slug = values.slug.trim() || slugFromName(values.name);
  if (!slug) {
    throw new Error('Slug is required');
  }

  return {
    name: values.name.trim(),
    slug,
    description: trimOrUndefined(values.description),
    logoUrl: trimOrUndefined(values.logoUrl),
    websiteUrl: trimOrUndefined(values.websiteUrl),
    active: values.active,
  };
}

export function adminBrandFormToUpdateRequest(
  values: AdminBrandV2FormValues,
): UpdateBrandRequest {
  return adminBrandFormToCreateRequest(values);
}
