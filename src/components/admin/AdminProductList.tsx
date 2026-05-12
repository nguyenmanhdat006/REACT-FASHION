import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
  /** 1-based current page */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
};

function AdminProductList({
  products,
  page: controlledPage,
  totalPages = 3,
  onPageChange,
  selectedIds: controlledSelected,
  onSelectedIdsChange,
  className,
}: AdminProductListProps) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const page = controlledPage ?? internalPage;
  const selectedList = controlledSelected ?? internalSelected;
  const selectedSet = useMemo(() => new Set(selectedList), [selectedList]);

  const setSelectedIds = useCallback(
    (next: string[]) => {
      onSelectedIdsChange?.(next);
      if (controlledSelected === undefined) {
        setInternalSelected(next);
      }
    },
    [controlledSelected, onSelectedIdsChange],
  );

  const setPage = useCallback(
    (next: number) => {
      onPageChange?.(next);
      if (controlledPage === undefined) {
        setInternalPage(next);
      }
    },
    [controlledPage, onPageChange],
  );

  const allIds = useMemo(() => products.map((p) => p.id), [products]);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedSet.has(id));
  const someSelected = allIds.some((id) => selectedSet.has(id));

  const headerCheckboxState = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  const toggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...allIds]);
    }
  }, [allIds, allSelected, setSelectedIds]);

  const toggleRow = useCallback(
    (id: string) => {
      const next = new Set(selectedSet);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setSelectedIds([...next]);
    },
    [selectedSet, setSelectedIds],
  );

  const goPrev = useCallback(() => {
    setPage(Math.max(1, page - 1));
  }, [page, setPage]);

  const goNext = useCallback(() => {
    setPage(Math.min(totalPages, page + 1));
  }, [page, setPage, totalPages]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  return (
    <div className={cn('font-sans', className)}>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-12 pl-4">
                <Checkbox
                  checked={headerCheckboxState}
                  onCheckedChange={toggleAll}
                  aria-label="Select all products"
                />
              </TableHead>
              <TableHead className="text-body-medium text-foreground">
                Product Name & Size
              </TableHead>
              <TableHead className="text-center text-body-medium text-foreground">
                Price
              </TableHead>
              <TableHead className="text-center text-body-medium text-foreground">
                Stock
              </TableHead>
              <TableHead className="text-center text-body-medium text-foreground">
                Category
              </TableHead>
              <TableHead className="w-12 pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-border">
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selectedSet.has(product.id)}
                    onCheckedChange={() => toggleRow(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
                <TableCell className="whitespace-normal py-4">
                  <div className="flex max-w-md items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="size-12 shrink-0 rounded-md object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="text-body-semi text-foreground">
                        {product.name}
                      </p>
                      <p className="text-caption-sm-regular text-muted-foreground">
                        {product.sizesLabel}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-body-regular text-foreground">
                  {product.priceFormatted}
                </TableCell>
                <TableCell className="whitespace-normal py-4 text-center">
                  <div className="text-caption-lg-medium text-foreground">
                    {product.stockLeft.toLocaleString()} Items Left
                  </div>
                  <div className="text-caption-sm-regular text-muted-foreground">
                    {product.sold.toLocaleString()} Sold
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/5 font-medium text-primary"
                  >
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground"
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 shadow-md ring-1 ring-foreground/5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            disabled={page <= 1}
            onClick={goPrev}
            aria-label="Previous page"
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
                n === page &&
                  'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            disabled={page >= totalPages}
            onClick={goNext}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductList;
