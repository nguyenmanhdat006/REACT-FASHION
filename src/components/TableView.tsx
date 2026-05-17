import React, { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type TableRowBase = { id: string };

export type TableColumn<T extends TableRowBase> = {
  id: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => React.ReactNode;
};

export type TableViewProps<T extends TableRowBase> = {
  rows: T[];
  columns: TableColumn<T>[];
  renderRowActions?: (row: T) => React.ReactNode;
  actionsHeaderClassName?: string;

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;

  selectAllAriaLabel?: string;
  getRowSelectionAriaLabel?: (row: T) => string;
  className?: string;
};

function TableView<T extends TableRowBase>({
  rows,
  columns,
  renderRowActions,
  actionsHeaderClassName,
  page: controlledPage,
  totalPages = 1,
  onPageChange,
  selectable = true,
  selectedIds: controlledSelected,
  onSelectedIdsChange,
  selectAllAriaLabel = 'Select all rows',
  getRowSelectionAriaLabel,
  className,
}: TableViewProps<T>) {
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

  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected =
    selectable && allIds.length > 0 && allIds.every((id) => selectedSet.has(id));
  const someSelected =
    selectable && allIds.some((id) => selectedSet.has(id));

  const headerCheckboxState = allSelected
    ? true
    : someSelected
      ? 'indeterminate'
      : false;

  const toggleAll = useCallback(() => {
    if (!selectable) return;
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...allIds]);
    }
  }, [allIds, allSelected, selectable, setSelectedIds]);

  const toggleRow = useCallback(
    (id: string) => {
      if (!selectable) return;
      const next = new Set(selectedSet);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setSelectedIds([...next]);
    },
    [selectedSet, selectable, setSelectedIds],
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

  const rowSelectionLabel = useCallback(
    (row: T) =>
      getRowSelectionAriaLabel?.(row) ?? `Select row ${row.id}`,
    [getRowSelectionAriaLabel],
  );

  return (
    <div className={cn('font-sans', className)}>
      <div className="mx-auto max-w-5xl overflow-x-auto overflow-y-visible rounded-xl border border-[1px] border-gray-100 bg-white text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow className="border-none shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
              {selectable ? (
                <TableHead className="w-12 pl-4">
                  <Checkbox
                    checked={headerCheckboxState}
                    onCheckedChange={toggleAll}
                    aria-label={selectAllAriaLabel}
                  />
                </TableHead>
              ) : null}
              {columns.map((col, colIndex) => (
                <TableHead
                  key={`${col.id}-${colIndex}`}
                  className={cn(
                    'text-body-medium text-foreground',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
              {renderRowActions ? (
                <TableHead
                  className={cn('w-12 pr-4 text-right', actionsHeaderClassName)}
                >
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-none">
                {selectable ? (
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selectedSet.has(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                      aria-label={rowSelectionLabel(row)}
                    />
                  </TableCell>
                ) : null}
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={`${col.id}-${colIndex}`}
                    className={col.cellClassName}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
                {renderRowActions ? (
                  <TableCell className="pr-4 text-right">
                    {renderRowActions(row)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">
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

export default TableView;
