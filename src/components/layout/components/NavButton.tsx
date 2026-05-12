import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NavButtonDefaultProps = {
  variant?: 'default';
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export type NavButtonCompactProps =
  | {
      variant: 'compact';
      icon: LucideIcon;
      label: string;
      onClick?: () => void;
      className?: string;
    }
  | {
      variant: 'compact';
      imageUrl: string;
      label: string;
      onClick?: () => void;
      className?: string;
    };

export type NavButtonProps = NavButtonDefaultProps | NavButtonCompactProps;

export function NavButton(props: NavButtonProps) {
  if (props.variant === 'compact') {
    const { label, onClick, className } = props;
    const CompactIcon = 'icon' in props ? props.icon : undefined;
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        className={cn(
          'relative flex self-stretch items-center gap-2 overflow-hidden rounded-2xl bg-white px-4 py-2 text-left',
          'h-auto justify-start hover:bg-gray-50',
          className,
        )}
      >
        {'imageUrl' in props ? (
          <span
            aria-hidden
            className="relative h-7 w-7 shrink-0 rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${props.imageUrl})` }}
          />
        ) : CompactIcon ? (
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center p-0.5">
            <CompactIcon className="h-6 w-6 text-gray-black" aria-hidden />
          </span>
        ) : null}
        <span className="relative w-fit whitespace-nowrap text-body-regular">{label}</span>
      </Button>
    );
  }

  const { icon: Icon, label, active = false, onClick, className } = props;
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
          aria-hidden
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
