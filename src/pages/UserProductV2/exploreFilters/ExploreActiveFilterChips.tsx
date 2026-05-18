import { X } from 'lucide-react';
import type { JSX } from 'react';

import type { ExploreFilterChip } from './types';

type ExploreActiveFilterChipsProps = {
  chips: ExploreFilterChip[];
  onRemove: (chipId: string) => void;
  onClearAll: () => void;
};

export function ExploreActiveFilterChips({
  chips,
  onRemove,
  onClearAll,
}: ExploreActiveFilterChipsProps): JSX.Element | null {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onRemove(chip.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-caption-lg-regular text-gray-800 transition-colors hover:bg-gray-200"
          aria-label={`Remove filter ${chip.label}`}
        >
          <span>{chip.label}</span>
          <X className="size-3.5 shrink-0 opacity-60" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-caption-lg-medium text-primary underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
