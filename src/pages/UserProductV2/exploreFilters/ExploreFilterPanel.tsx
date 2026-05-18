import { X } from 'lucide-react';
import type { JSX, ReactNode } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import {
  EXPLORE_MOCK_BRANDS,
  EXPLORE_MOCK_CATEGORIES,
  EXPLORE_SORT_OPTIONS,
} from './constants';
import type { ExploreFilterState, ExploreSortOption } from './types';

const ALL_OPTION = '__all__';

type ExploreFilterPanelProps = {
  open: boolean;
  draft: ExploreFilterState;
  onClose: () => void;
  onDraftChange: (patch: Partial<ExploreFilterState>) => void;
  onApply: () => void;
  onClearAll: () => void;
};

export function ExploreFilterPanel({
  open,
  draft,
  onClose,
  onDraftChange,
  onApply,
  onClearAll,
}: ExploreFilterPanelProps): JSX.Element | null {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] md:bg-black/35"
        aria-label="Close filters overlay"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="explore-filters-title"
        className={cn(
          'fixed z-[61] flex flex-col bg-white shadow-xl',
          'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl',
          'md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-full md:max-w-[400px] md:rounded-none md:rounded-l-2xl',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="explore-filters-title" className="text-h4-medium text-gray-black">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close filters"
          >
            <X className="size-5" />
          </button>
        </header>

        <PanelScroll>
          <FilterField label="Category">
            <Select
              value={draft.categoryId ?? ALL_OPTION}
              onValueChange={(value) =>
                onDraftChange({
                  categoryId: value === ALL_OPTION ? undefined : value,
                })
              }
            >
              <SelectTrigger className="w-full rounded-xl" aria-label="Category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {EXPLORE_MOCK_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value || ALL_OPTION} value={value || ALL_OPTION}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Brand">
            <Select
              value={draft.brandId ?? ALL_OPTION}
              onValueChange={(value) =>
                onDraftChange({
                  brandId: value === ALL_OPTION ? undefined : value,
                })
              }
            >
              <SelectTrigger className="w-full rounded-xl" aria-label="Brand">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                {EXPLORE_MOCK_BRANDS.map(({ value, label }) => (
                  <SelectItem key={value || ALL_OPTION} value={value || ALL_OPTION}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Price">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <Input
                type="number"
                min={0}
                inputMode="decimal"
                placeholder="Min"
                value={draft.minPrice ?? ''}
                onChange={(e) =>
                  onDraftChange({ minPrice: e.target.value || undefined })
                }
                className="rounded-xl"
                aria-label="Minimum price"
              />
              <span className="text-caption-lg-regular text-gray-400">—</span>
              <Input
                type="number"
                min={0}
                inputMode="decimal"
                placeholder="Max"
                value={draft.maxPrice ?? ''}
                onChange={(e) =>
                  onDraftChange({ maxPrice: e.target.value || undefined })
                }
                className="rounded-xl"
                aria-label="Maximum price"
              />
            </div>
          </FilterField>

          <div className="flex items-center justify-between gap-4 py-1">
            <Label htmlFor="explore-featured" className="text-body-regular text-gray-black">
              Only featured items
            </Label>
            <Switch
              id="explore-featured"
              checked={draft.featured}
              onCheckedChange={(checked) => onDraftChange({ featured: checked })}
            />
          </div>

          <FilterField label="Sort by">
            <Select
              value={draft.sort}
              onValueChange={(value) =>
                onDraftChange({ sort: value as ExploreSortOption })
              }
            >
              <SelectTrigger className="w-full rounded-xl" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPLORE_SORT_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </PanelScroll>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-gray-100 px-6 py-4">
          <LabelButton
            label="Apply filters"
            tone="primary"
            className="w-full justify-center"
            onClick={onApply}
          />
          <LabelButton
            label="Clear all"
            tone="muted"
            className="w-full justify-center"
            onClick={onClearAll}
          />
        </footer>
      </aside>
    </>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-caption-lg-medium text-gray-600">{label}</Label>
      {children}
    </div>
  );
}

function PanelScroll({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5 scrollbar-hide">
      {children}
    </div>
  );
}
