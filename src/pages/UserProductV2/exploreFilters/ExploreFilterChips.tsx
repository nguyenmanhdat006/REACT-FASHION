import { X } from 'lucide-react';
import type { JSX } from 'react';

import { Badge } from '@/components/ui/badge';

import type { ExploreFilterChip } from './constants';

type ExploreFilterChipsProps = {
  chips: ExploreFilterChip[];
  onRemove: (chipId: string) => void;
  onClearAll: () => void;
};

export function ExploreFilterChips({
  chips,
  onRemove,
  onClearAll,
}: ExploreFilterChipsProps): JSX.Element | null {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="secondary"
          className="h-auto gap-1 rounded-full px-3 py-1.5 text-caption-lg-regular"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.id)}
            className="inline-flex rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </Badge>
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
