import { cn } from '@/lib/utils';
import { IMAGES } from '@/constants/images';

interface UserButtonProps {
  userName?: string;
  avatarUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const UserButton = ({
  userName = 'Tường',
  avatarUrl = IMAGES.USER_AVATAR,
  onClick,
  className,
}: UserButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open profile for ${userName}`}
      className={cn(
        'relative inline-flex h-auto items-center justify-center gap-2.5 overflow-hidden rounded-[64px] bg-white p-2',
        'hover:bg-primary/80 hover:text-white',
        className
      )}
    >
      <span
        className="relative h-10 w-10 rounded-[64px] bg-cover bg-center"
        style={{ backgroundImage: `url(${avatarUrl})` }}
        aria-hidden
      />
      <span
        className={cn(
          'relative w-fit whitespace-nowrap text-body-regular'
        )}
      >
        {userName || 'USER'}
      </span>
    </button>
  );
};
