import { ArrowUpRight, Heart } from 'lucide-react';
import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ActionIconVariant = 'external' | 'favorite';

type ActionIconButtonProps = {
  type: ActionIconVariant;
  label: string;
};

export function ActionIconButton({
  type,
  label,
}: ActionIconButtonProps): JSX.Element {
  return (
    <Button
      type="button"
      aria-label={label}
      variant="secondary"
      size="sm"
      className={cn(
        'h-auto flex-[0_0_auto] shrink-0 gap-0 rounded-2xl p-2',
        '[&_svg]:size-6',
      )}
    >
      <span className="relative flex items-center justify-center rounded-md p-0.5">
        {type === 'external' ? (
          <ArrowUpRight aria-hidden />
        ) : (
          <Heart aria-hidden />
        )}
      </span>
    </Button>
  );
}
