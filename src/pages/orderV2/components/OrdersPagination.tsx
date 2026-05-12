import { JSX } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OrdersPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: OrdersPaginationProps): JSX.Element => {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex items-center gap-2 px-2 py-2 bg-white rounded-full shadow-md overflow-hidden"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="rounded-full"
      >
        <FiChevronLeft className="w-4 h-6" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          type="button"
          variant={currentPage === page ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          className="rounded-2xl"
        >
          {page}
        </Button>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="rounded-full"
      >
        <FiChevronRight className="w-4 h-6" />
      </Button>
    </nav>
  );
};
