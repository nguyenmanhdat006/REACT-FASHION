import { UserRound } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { initialsFromDisplayName } from '@/utils/displayName';

export type UserButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  userName?: string;
  /** Profile image URL; omit or pass null/empty to show initials instead */
  avatarUrl?: string | null;
  ariaLabel?: string;
};

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(function UserButton(
  { userName = 'Guest', avatarUrl, className, ariaLabel, type = 'button', ...props },
  ref,
) {
  const label = userName.trim() || 'Guest';
  const hasPhoto = Boolean(avatarUrl?.trim());
  const initials = initialsFromDisplayName(label);

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel ?? `Open account menu for ${label}`}
      className={cn(
        'relative inline-flex h-auto items-center justify-center gap-2.5 overflow-hidden rounded-[64px] bg-white p-2',
        'hover:bg-gray-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'data-[state=open]:bg-gray-50',
        className,
      )}
      {...props}
    >
      {hasPhoto ? (
        <span
          className="relative h-10 w-10 shrink-0 rounded-[64px] bg-cover bg-top"
          style={{ backgroundImage: `url(${avatarUrl})` }}
          aria-hidden
        />
      ) : (
        <span
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[64px] bg-gray-100 text-caption-lg-semibold uppercase text-gray-700"
          aria-hidden
        >
          {initials ? (
            initials
          ) : (
            <UserRound className="size-5 text-gray-500" strokeWidth={1.75} />
          )}
        </span>
      )}
      <span className={cn('relative w-fit max-w-[140px] truncate text-left text-body-regular')}>
        {label}
      </span>
    </button>
  );
});
