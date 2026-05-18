import { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationBarProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const page = Math.max(1, Math.min(currentPage, safeTotalPages));

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, Math.min(next, safeTotalPages));
      if (clamped !== page) {
        onPageChange(clamped);
      }
    },
    [onPageChange, page, safeTotalPages],
  );

  const goPrev = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const goNext = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: safeTotalPages }, (_, i) => i + 1),
    [safeTotalPages],
  );

  if (safeTotalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('mt-6 flex justify-center', className)}>
      <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={goPrev}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pageNumbers.map((n) => (
          <Button
            key={n}
            type="button"
            variant={n === page ? 'default' : 'ghost'}
            size="icon-sm"
            className={cn(
              'size-8 rounded-full',
              n === page && 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            onClick={() => goToPage(n)}
          >
            {n}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          disabled={page >= safeTotalPages}
          onClick={goNext}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
