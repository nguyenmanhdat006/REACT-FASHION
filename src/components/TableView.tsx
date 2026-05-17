import React, { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import TableRowActionsMenuTrigger from '@/components/TableRowActionsMenuTrigger';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export type TableRowBase = { id: string };

export type TableColumn<T extends TableRowBase> = {
  id: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: T) => React.ReactNode;
};

export type TableRowExtraAction<T> = {
  label: string;
  onSelect: (row: T) => void;
};

export type TableViewProps<T extends TableRowBase> = {
  rows: T[];
  columns: TableColumn<T>[];
  /** Built-in row menu — item shown only when matching callback is passed. */
  onDetail?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraRowActions?: TableRowExtraAction<T>[];
  rowActionsMenuClassName?: string;
  /** Custom actions cell (e.g. Order inline buttons). Overrides built-in menu. */
  renderRowActions?: (row: T) => React.ReactNode;
  actionsHeaderClassName?: string;

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  selectable?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;

  className?: string;
};

function TableView<T extends TableRowBase>({
  rows,
  columns,
  onDetail,
  onEdit,
  onDelete,
  extraRowActions,
  rowActionsMenuClassName,
  renderRowActions,
  actionsHeaderClassName,
  page: controlledPage,
  totalPages = 1,
  onPageChange,
  selectable = true,
  selectedIds: controlledSelected,
  onSelectedIdsChange,
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

  const hasBuiltInRowActions = Boolean(
    onDetail ?? onEdit ?? onDelete ?? (extraRowActions && extraRowActions.length > 0),
  );
  const showActionsColumn = Boolean(renderRowActions ?? hasBuiltInRowActions);

  const renderActionsCell = useCallback(
    (row: T) => {
      if (renderRowActions) {
        return renderRowActions(row);
      }
      if (!hasBuiltInRowActions) {
        return null;
      }
      const extra = extraRowActions ?? [];

      return (
        <DropdownMenu>
          <TableRowActionsMenuTrigger label="Actions" />
          <DropdownMenuContent align="end" className={rowActionsMenuClassName}>
            {onDetail ? (
              <DropdownMenuItem onSelect={() => onDetail(row)}>Detail</DropdownMenuItem>
            ) : null}
            {onEdit ? (
              <DropdownMenuItem onSelect={() => onEdit(row)}>Edit</DropdownMenuItem>
            ) : null}
            {extra.map((action) => (
              <DropdownMenuItem
                key={action.label}
                onSelect={() => action.onSelect(row)}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
            {onDelete ? (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => void onDelete(row)}
              >
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    [
      renderRowActions,
      hasBuiltInRowActions,
      onDetail,
      onEdit,
      onDelete,
      extraRowActions,
      rowActionsMenuClassName,
    ],
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
              {showActionsColumn ? (
                <TableHead
                  className={cn('w-12 pr-4 text-right', actionsHeaderClassName)}
                />
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
                {showActionsColumn ? (
                  <TableCell className="pr-4 text-right">
                    {renderActionsCell(row)}
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
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableView;
