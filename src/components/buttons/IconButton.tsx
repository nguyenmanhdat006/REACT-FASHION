import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonBaseProps = Omit<ComponentProps<typeof Button>, 'children'>;

export interface IconButtonProps extends ButtonBaseProps {
  icon: LucideIcon;
  ariaLabel: string;
  iconClassName?: string;
}

export function IconButton({
  icon: Icon,
  ariaLabel,
  className,
  iconClassName,
  variant = 'ghost',
  size = 'lg',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <Button
      {...rest}
      type={type}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={cn(
        'h-auto rounded-full bg-gray-50 px-4 py-4 hover:bg-gray-100',
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn('size-6 text-gray-black', iconClassName)}
      />
    </Button>
  );
}
