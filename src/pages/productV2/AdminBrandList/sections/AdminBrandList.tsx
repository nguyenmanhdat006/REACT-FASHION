import { useMemo } from 'react';
import { MoreVertical } from 'lucide-react';

import TableView, { type TableColumn } from '@/components/TableView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type AdminBrandRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  active: boolean;
};

export type AdminBrandListProps = {
  brands: AdminBrandRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onDeleteBrand?: (brand: AdminBrandRow) => void;
};

function buildBrandColumns(): TableColumn<AdminBrandRow>[] {
  return [
    {
      id: 'name',
      header: 'Brand',
      cellClassName: 'whitespace-normal py-4',
      cell: (brand) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-2 text-body-regular text-foreground">{brand.name}</p>
          <p className="text-caption-sm-regular text-gray-500">{brand.slug}</p>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cellClassName: 'whitespace-normal py-4',
      cell: (brand) => (
        <p className="line-clamp-2 max-w-md text-caption-lg-regular text-gray-700">
          {brand.description}
        </p>
      ),
    },
    {
      id: 'website',
      header: 'Website',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-sm-regular text-gray-500',
      cell: (brand) => (
        <span className="line-clamp-1">{brand.websiteUrl}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (brand) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            brand.active
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-gray-200 bg-gray-100 text-gray-700',
          )}
        >
          {brand.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];
}

function AdminBrandList({
  brands,
  page,
  totalPages = 1,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onDeleteBrand,
}: AdminBrandListProps) {
  const columns = useMemo(() => buildBrandColumns(), []);

  return (
    <TableView
      className={className}
      rows={brands}
      columns={columns}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      selectAllAriaLabel="Select all brands"
      getRowSelectionAriaLabel={(b) => `Select ${b.name}`}
      renderRowActions={(brand) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={`Actions for ${brand.name}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteBrand?.(brand)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminBrandList;
