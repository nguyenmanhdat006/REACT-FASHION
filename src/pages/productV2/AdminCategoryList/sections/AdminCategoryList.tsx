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

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  parentLabel: string;
  productCount: number;
  displayOrder: number;
  active: boolean;
  imageUrl: string;
};

export type AdminCategoryListProps = {
  categories: AdminCategoryRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onDeleteCategory?: (category: AdminCategoryRow) => void;
};

function buildCategoryColumns(): TableColumn<AdminCategoryRow>[] {
  return [
    {
      id: 'thumb',
      header: '',
      cellClassName: 'whitespace-normal py-4',
      cell: (category) => (
        <img
          src={category.imageUrl}
          alt=""
          className="size-12 shrink-0 rounded-md object-cover"
          loading="lazy"
        />
      ),
    },
    {
      id: 'name',
      header: 'Category',
      cellClassName: 'whitespace-normal py-4',
      cell: (category) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-2 text-body-regular text-foreground">
            {category.name}
          </p>
          <p className="text-caption-sm-regular text-gray-500">{category.slug}</p>
        </div>
      ),
    },
    {
      id: 'parent',
      header: 'Parent',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (category) => category.parentLabel,
    },
    {
      id: 'products',
      header: 'Products',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-medium text-foreground',
      cell: (category) => category.productCount.toLocaleString(),
    },
    {
      id: 'order',
      header: 'Order',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (category) => category.displayOrder,
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (category) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            category.active
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-gray-200 bg-gray-100 text-gray-700',
          )}
        >
          {category.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];
}

function AdminCategoryList({
  categories,
  page,
  totalPages = 1,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onDeleteCategory,
}: AdminCategoryListProps) {
  const columns = useMemo(() => buildCategoryColumns(), []);

  return (
    <TableView
      className={className}
      rows={categories}
      columns={columns}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      selectAllAriaLabel="Select all categories"
      getRowSelectionAriaLabel={(c) => `Select ${c.name}`}
      renderRowActions={(category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={`Actions for ${category.name}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteCategory?.(category)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminCategoryList;
