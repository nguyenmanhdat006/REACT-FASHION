import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavButton({
  icon: Icon,
  label,
  active = false,
  onClick,
  className,
}: NavButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex self-stretch items-center gap-2 overflow-hidden rounded-2xl p-4 text-left',
        'h-auto justify-start focus-visible:ring-offset-0',
        active ? 'bg-primary hover:bg-primary' : 'hover:bg-gray-50',
        className,
      )}
    >
      <span className="relative flex shrink-0 items-center justify-center p-0.5">
        <Icon
          className={cn(
            'h-6 w-6',
            active ? 'text-gray-white' : 'text-gray-black',
          )}
        />
      </span>
      <span
        className={cn(
          'relative w-fit whitespace-nowrap text-body-regular',
          active ? 'text-gray-white' : 'text-gray-black',
        )}
      >
        {label}
      </span>
    </Button>
  );
}
