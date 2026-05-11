import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonBaseProps = Omit<ComponentProps<typeof Button>, 'children'>;

export interface IconLabelButtonProps extends ButtonBaseProps {
  icon: LucideIcon;
  label: string;
  ariaLabel?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export function IconLabelButton({
  icon: Icon,
  label,
  ariaLabel,
  className,
  iconClassName,
  labelClassName,
  variant = 'ghost',
  size = 'lg',
  type = 'button',
  ...rest
}: IconLabelButtonProps) {
  return (
    <Button
      {...rest}
      type={type}
      variant={variant}
      size={size}
      aria-label={ariaLabel ?? label}
      className={cn(
        'h-auto gap-2 rounded-2xl bg-gray-50 px-4 py-4 text-body-regular text-gray-black hover:bg-gray-100',
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-6 text-gray-black', iconClassName)}
      />
      <span
        className={cn(
          'relative w-fit whitespace-nowrap text-body-regular text-gray-black',
          labelClassName,
        )}
      >
        {label}
      </span>
    </Button>
  );
}
