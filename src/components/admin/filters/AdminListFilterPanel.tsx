import type { JSX } from 'react';

import AdminEntitySidePanel from '@/components/admin/AdminEntitySidePanel';
import AdminFormFooter from '@/components/admin/AdminFormFooter';
import { FormField } from '@/components/FormField';
import { LabeledInputField } from '@/components/form/LabeledInputField';

import {
  ADMIN_ACTIVE_OPTIONS,
  ADMIN_PRODUCT_STATUS_OPTIONS,
  ADMIN_PUBLISHED_OPTIONS,
  ADMIN_USER_ROLE_OPTIONS,
  ADMIN_USER_STATUS_OPTIONS,
  ALL_OPTION,
  type AdminListFilterPreset,
  type AdminListFilters,
} from './constants';

export type AdminListFilterPanelProps = {
  preset: AdminListFilterPreset;
  open: boolean;
  draft: AdminListFilters;
  categoryOptions?: { value: string; label: string }[];
  brandOptions?: { value: string; label: string }[];
  onClose: () => void;
  onDraftChange: (patch: Partial<AdminListFilters>) => void;
  onApply: () => void;
  onClearAll: () => void;
};

export function AdminListFilterPanel({
  preset,
  open,
  draft,
  categoryOptions = [],
  brandOptions = [],
  onClose,
  onDraftChange,
  onApply,
  onClearAll,
}: AdminListFilterPanelProps): JSX.Element {
  return (
    <AdminEntitySidePanel
      open={open}
      title="Filters"
      onClose={onClose}
      className="z-[61] max-w-[400px]"
      overlayClassName="z-[60] bg-black/40 backdrop-blur-[1px]"
      footer={
        <AdminFormFooter
          cancelLabel="Clear all"
          submitLabel="Apply filters"
          onCancel={onClearAll}
          onSubmit={onApply}
        />
      }
    >
      <div className="flex flex-col gap-5">
        <LabeledInputField
          id="admin-filter-search"
          label="Search"
          mode="edit"
          placeholder={
            preset === 'user'
              ? 'Name, email, or phone'
              : 'Name or slug'
          }
          value={draft.q ?? ''}
          onChange={e => onDraftChange({ q: e.target.value || undefined })}
        />

        {preset === 'category' || preset === 'brand' ? (
          <FormField
            id="admin-filter-active"
            label="Status"
            variant="selection"
            placeholder="All statuses"
            options={ADMIN_ACTIVE_OPTIONS}
            value={draft.active ?? 'all'}
            onValueChange={value =>
              onDraftChange({ active: value as AdminListFilters['active'] })
            }
          />
        ) : null}

        {preset === 'product' ? (
          <>
            <FormField
              id="admin-filter-category"
              label="Category"
              variant="selection"
              placeholder="All categories"
              options={categoryOptions}
              value={draft.categoryId ?? ALL_OPTION}
              onValueChange={value =>
                onDraftChange({
                  categoryId: value === ALL_OPTION ? undefined : value,
                })
              }
            />
            <FormField
              id="admin-filter-brand"
              label="Brand"
              variant="selection"
              placeholder="All brands"
              options={brandOptions}
              value={draft.brandId ?? ALL_OPTION}
              onValueChange={value =>
                onDraftChange({
                  brandId: value === ALL_OPTION ? undefined : value,
                })
              }
            />
            <FormField
              id="admin-filter-published"
              label="Published"
              variant="selection"
              placeholder="All"
              options={ADMIN_PUBLISHED_OPTIONS}
              value={draft.published ?? 'all'}
              onValueChange={value =>
                onDraftChange({
                  published: value as AdminListFilters['published'],
                })
              }
            />
            <FormField
              id="admin-filter-product-status"
              label="Product status"
              variant="selection"
              placeholder="All statuses"
              options={ADMIN_PRODUCT_STATUS_OPTIONS}
              value={draft.status ?? ALL_OPTION}
              onValueChange={value => onDraftChange({ status: value })}
            />
          </>
        ) : null}

        {preset === 'user' ? (
          <>
            <FormField
              id="admin-filter-role"
              label="Role"
              variant="selection"
              placeholder="All roles"
              options={ADMIN_USER_ROLE_OPTIONS}
              value={draft.role ?? ALL_OPTION}
              onValueChange={value => onDraftChange({ role: value })}
            />
            <FormField
              id="admin-filter-user-status"
              label="Account status"
              variant="selection"
              placeholder="All statuses"
              options={ADMIN_USER_STATUS_OPTIONS}
              value={draft.status ?? ALL_OPTION}
              onValueChange={value => onDraftChange({ status: value })}
            />
          </>
        ) : null}
      </div>
    </AdminEntitySidePanel>
  );
}
