import { useMemo } from 'react';

import TableView, { type TableColumn } from '@/components/TableView';
import TableRowActionsMenuTrigger from '@/components/TableRowActionsMenuTrigger';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type AdminProductRow = {
  id: string;
  name: string;
  sizesLabel: string;
  imageUrl: string;
  priceFormatted: string;
  stockLeft: number;
  sold: number;
  category: string;
};

export type AdminProductListProps = {
  products: AdminProductRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onViewProduct?: (product: AdminProductRow) => void;
  onEditProduct?: (product: AdminProductRow) => void;
  onDeleteProduct?: (product: AdminProductRow) => void;
};

function buildProductColumns(): TableColumn<AdminProductRow>[] {
  return [
    {
      id: 'thumb',
      header: '',
      cellClassName: 'whitespace-normal py-4',
      cell: (product) => (
        <div className="flex max-w-md items-center gap-3">
          <img
            src={product.imageUrl}
            alt=""
            className="size-12 shrink-0 rounded-md object-cover"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Product Name & Size',
      cellClassName: 'whitespace-normal py-4',
      cell: (product) => (
        <div className="flex max-w-md items-center gap-3">
          <div className="min-w-0">
            <p className="text-body-regular text-foreground">{product.name}</p>
            <p className="text-caption-sm-regular text-gray-500">
              {product.sizesLabel}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (product) => product.priceFormatted,
    },
    {
      id: 'stock',
      header: 'Stock',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'whitespace-normal py-4 text-center',
      cell: (product) => (
        <>
          <div className="text-caption-lg-medium text-foreground">
            {product.stockLeft.toLocaleString()} Items Left
          </div>
          <div className="text-caption-sm-regular text-muted-foreground">
            {product.sold.toLocaleString()} Sold
          </div>
        </>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (product) => (
        <Badge
          variant="outline"
          className="border-primary/40 bg-primary/5 text-primary text-caption-sm-regular rounded-sm"
        >
          {product.category}
        </Badge>
      ),
    },
  ];
}

function AdminProductList({
  products,
  page,
  totalPages = 3,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: AdminProductListProps) {
  const columns = useMemo(() => buildProductColumns(), []);

  return (
    <TableView
      className={className}
      rows={products}
      columns={columns}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      selectAllAriaLabel="Select all products"
      getRowSelectionAriaLabel={(p) => `Select ${p.name}`}
      renderRowActions={(product) => (
        <DropdownMenu>
          <TableRowActionsMenuTrigger label={`Actions for ${product.name}`} />
          <DropdownMenuContent align="end" className="min-w-36">
            <DropdownMenuItem
              onSelect={() => {
                onViewProduct?.(product);
              }}
            >
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                onEditProduct?.(product);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => {
                onDeleteProduct?.(product);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminProductList;
