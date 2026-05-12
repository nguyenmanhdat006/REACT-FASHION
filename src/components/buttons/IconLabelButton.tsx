import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonBaseProps = Omit<ComponentProps<typeof Button>, 'children'>;

export type IconLabelButtonPillVariant = 'default' | 'muted' | 'selected';

const PILL_VARIANT_STYLES: Record<
  IconLabelButtonPillVariant,
  { root: string; icon: string; label: string }
> = {
  default: {
    root: 'border border-transparent bg-gray-50 hover:bg-gray-100',
    icon: 'text-gray-black',
    label: 'text-gray-black',
  },
  muted: {
    root: 'border border-transparent bg-gray-50/70 hover:bg-gray-100/80',
    icon: 'text-gray-500',
    label: 'text-gray-500',
  },
  selected: {
    root: 'border border-gray-300 bg-gray-50 hover:bg-gray-100',
    icon: 'text-gray-black',
    label: 'text-gray-black',
  },
};

export interface IconLabelButtonProps extends ButtonBaseProps {
  icon: LucideIcon;
  label: string;
  ariaLabel?: string;
  iconClassName?: string;
  labelClassName?: string;
  pillVariant?: IconLabelButtonPillVariant;
}

export function IconLabelButton({
  icon: Icon,
  label,
  ariaLabel,
  className,
  iconClassName,
  labelClassName,
  pillVariant = 'default',
  variant = 'ghost',
  size = 'lg',
  type = 'button',
  ...rest
}: IconLabelButtonProps) {
  const pill = PILL_VARIANT_STYLES[pillVariant];

  return (
    <Button
      {...rest}
      type={type}
      variant={variant}
      size={size}
      aria-label={ariaLabel ?? label}
      className={cn(
        'h-auto gap-2 rounded-2xl px-4 py-4 text-body-regular',
        pill.root,
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-6 shrink-0', pill.icon, iconClassName)}
      />
      <span
        className={cn(
          'relative w-fit whitespace-nowrap text-body-regular',
          pill.label,
          labelClassName,
        )}
      >
        {label}
      </span>
    </Button>
  );
}
