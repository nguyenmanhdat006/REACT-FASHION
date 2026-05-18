import type {
  Category,
  CategoryPayload,
  UpdateCategoryRequest,
} from '@/types/product/product';
import {
  optionalNonNegativeInt,
  slugFromName,
  trimOrUndefined,
} from '@/utils/formFields';

import { ADMIN_CATEGORY_NO_PARENT } from './constants';
import type { AdminCategoryV2FormValues } from './types';

function parentIdFromForm(value: string | undefined): string | null | undefined {
  const v = value?.trim();
  if (!v || v === ADMIN_CATEGORY_NO_PARENT) return null;
  return v;
}

function parentIdToForm(parentId: string | null | undefined): string {
  if (!parentId?.trim()) return ADMIN_CATEGORY_NO_PARENT;
  return parentId.trim();
}

export function categoryToAdminCategoryFormValues(
  category: Category,
): AdminCategoryV2FormValues {
  return {
    name: category.name?.trim() ?? '',
    slug: category.slug?.trim() ?? '',
    description: category.description?.trim() ?? '',
    parentId: parentIdToForm(category.parentId),
    displayOrder: String(category.displayOrder ?? 0),
    active: category.active !== false,
  };
}

export function adminCategoryFormToCreateRequest(
  values: AdminCategoryV2FormValues,
): CategoryPayload {
  const slug = values.slug.trim() || slugFromName(values.name);
  if (!slug) {
    throw new Error('Slug is required');
  }

  return {
    name: values.name.trim(),
    slug,
    description: trimOrUndefined(values.description),
    parentId: parentIdFromForm(values.parentId),
    active: values.active,
    displayOrder: optionalNonNegativeInt(values.displayOrder) ?? 0,
  };
}

export function adminCategoryFormToUpdateRequest(
  values: AdminCategoryV2FormValues,
): UpdateCategoryRequest {
  return adminCategoryFormToCreateRequest(values);
}
