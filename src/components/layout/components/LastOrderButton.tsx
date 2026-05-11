import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface LastOrderButtonProps {
  label: string;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

export function LastOrderButton({
  label,
  imageUrl,
  onClick,
  className,
}: LastOrderButtonProps) {
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
      <span
        aria-hidden
        className="relative h-7 w-7 rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <span className="relative w-fit whitespace-nowrap text-body-regular">
        {label}
      </span>
    </Button>
  );
}
