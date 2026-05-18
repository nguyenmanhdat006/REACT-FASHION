import type { JSX } from 'react';

import AdminEntitySidePanel from '@/components/admin/AdminEntitySidePanel';
import AdminFormFooter from '@/components/admin/AdminFormFooter';
import { FormField } from '@/components/FormField';
import { LabeledInputField } from '@/components/form/LabeledInputField';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { ALL_OPTION, EXPLORE_SORT_OPTIONS } from './constants';
import type { ExploreFilters, ExploreSortOption } from './constants';

type ExploreFilterPanelProps = {
  open: boolean;
  draft: ExploreFilters;
  categoryOptions: { value: string; label: string }[];
  brandOptions: { value: string; label: string }[];
  onClose: () => void;
  onDraftChange: (patch: Partial<ExploreFilters>) => void;
  onApply: () => void;
  onClearAll: () => void;
};

export function ExploreFilterPanel({
  open,
  draft,
  categoryOptions,
  brandOptions,
  onClose,
  onDraftChange,
  onApply,
  onClearAll,
}: ExploreFilterPanelProps): JSX.Element {
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
        <FormField
          id="explore-category"
          label="Category"
          variant="selection"
          placeholder="All categories"
          options={categoryOptions}
          value={draft.categoryId ?? ALL_OPTION}
          onValueChange={(value) =>
            onDraftChange({
              categoryId: value === ALL_OPTION ? undefined : value,
            })
          }
        />

        <FormField
          id="explore-brand"
          label="Brand"
          variant="selection"
          placeholder="All brands"
          options={brandOptions}
          value={draft.brandId ?? ALL_OPTION}
          onValueChange={(value) =>
            onDraftChange({
              brandId: value === ALL_OPTION ? undefined : value,
            })
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledInputField
            id="explore-min-price"
            label="Min price"
            mode="edit"
            type="number"
            placeholder="Min"
            value={draft.minPrice ?? ''}
            onChange={(e) =>
              onDraftChange({ minPrice: e.target.value || undefined })
            }
          />
          <LabeledInputField
            id="explore-max-price"
            label="Max price"
            mode="edit"
            type="number"
            placeholder="Max"
            value={draft.maxPrice ?? ''}
            onChange={(e) =>
              onDraftChange({ maxPrice: e.target.value || undefined })
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="explore-featured" className="text-body-regular text-gray-black">
            Only featured items
          </Label>
          <Switch
            id="explore-featured"
            checked={draft.featured}
            onCheckedChange={(checked) => onDraftChange({ featured: checked })}
          />
        </div>

        <FormField
          id="explore-sort"
          label="Sort by"
          variant="selection"
          placeholder="Sort by"
          options={EXPLORE_SORT_OPTIONS}
          value={draft.sort}
          onValueChange={(value) =>
            onDraftChange({ sort: value as ExploreSortOption })
          }
        />
      </div>
    </AdminEntitySidePanel>
  );
}
