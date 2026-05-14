import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonBaseProps = Omit<ComponentProps<typeof Button>, 'children'>;

export type LabelButtonTone = 'default' | 'primary' | 'muted';

export interface LabelButtonProps extends ButtonBaseProps {
  label: string;
  ariaLabel?: string;
  labelClassName?: string;
  tone?: LabelButtonTone;
}

const TONE_STYLES: Record<
  LabelButtonTone,
  { container: string; label: string }
> = {
  default: {
    container: 'bg-gray-50 hover:bg-gray-100',
    label: 'text-gray-black',
  },
  primary: {
    container: 'bg-primary text-white hover:bg-primary/80',
    label: 'text-white',
  },
  muted: {
    container: 'bg-gray-50/70 hover:bg-gray-100/80',
    label: 'text-gray-500',
  },
};

export function LabelButton({
  label,
  ariaLabel,
  className,
  labelClassName,
  tone = 'default',
  variant,
  type = 'button',
  ...rest
}: LabelButtonProps) {
  const tones = TONE_STYLES[tone];
  const resolvedVariant = variant ?? (tone === 'primary' ? 'default' : 'ghost');

  return (
    <Button
      {...rest}
      type={type}
      variant={resolvedVariant}
      aria-label={ariaLabel ?? label}
      className={cn(
        'h-auto overflow-hidden rounded-[32px] px-8 py-3',
        tones.container,
        className,
      )}
    >
      <span
        className={cn(
          'relative w-fit whitespace-nowrap text-body-regular',
          tones.label,
          labelClassName,
        )}
      >
        {label}
      </span>
    </Button>
  );
}
