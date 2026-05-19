import { Filter, Plus } from 'lucide-react';
import type { JSX, ReactNode } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { cn } from '@/lib/utils';

export type AdminListToolbarProps = {
  onFiltersClick?: () => void;
  activeFilterCount?: number;
  filtersAriaLabel?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
  addAriaLabel?: string;
  extra?: ReactNode;
  className?: string;
};

export function AdminListToolbar({
  onFiltersClick,
  activeFilterCount = 0,
  filtersAriaLabel = 'Open filters',
  onAddClick,
  showAddButton = true,
  addAriaLabel = 'Add',
  extra,
  className,
}: AdminListToolbarProps): JSX.Element {
  const filterAriaLabel =
    activeFilterCount > 0
      ? `${filtersAriaLabel}, ${activeFilterCount} active`
      : filtersAriaLabel;

  return (
    <div className={cn('mb-2 flex justify-start gap-3', className)}>
      <div className="relative shrink-0">
        <IconButton
          icon={Filter}
          ariaLabel={filterAriaLabel}
          onClick={onFiltersClick}
          className="bg-gray-white px-3 py-3 hover:bg-gray-100"
          iconClassName="size-5 text-gray-black"
        />
        {activeFilterCount > 0 ? (
          <span
            className="pointer-events-none absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-caption-xs-regular font-medium text-white"
            aria-hidden
          >
            {activeFilterCount}
          </span>
        ) : null}
      </div>
      {showAddButton ? (
        <IconButton
          icon={Plus}
          ariaLabel={addAriaLabel}
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 px-3 py-3"
          iconClassName="text-white size-5"
        />
      ) : null}
      {extra}
    </div>
  );
}
