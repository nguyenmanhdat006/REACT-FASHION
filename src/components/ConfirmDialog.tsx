import { AlertTriangle, X } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'destructive',
  loading = false,
  onConfirm,
}: ConfirmDialogProps): JSX.Element {
  const resolvedConfirmLabel =
    confirmLabel ?? (confirmVariant === 'destructive' ? 'Yes, delete it' : 'Confirm');

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    void Promise.resolve(onConfirm());
  };

  const isDestructive = confirmVariant === 'destructive';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="relative max-w-[400px] gap-0 border-0 px-6 pb-6 pt-8 shadow-xl">
        <AlertDialogCancel
          disabled={loading}
          className={cn(
            'absolute right-4 top-4 flex size-8 items-center justify-center rounded-md border-0 bg-transparent p-0',
            'text-gray-400 shadow-none hover:bg-gray-100 hover:text-gray-600',
            'focus-visible:ring-2 focus-visible:ring-gray-200'
          )}
          aria-label="Close"
        >
          <X className="size-4" />
        </AlertDialogCancel>

        {isDestructive ? (
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-6 text-red-500" strokeWidth={2} />
          </div>
        ) : null}

        <AlertDialogHeader className="items-center gap-2 text-center sm:text-center">
          <AlertDialogTitle className="text-h6-medium text-foreground">
            {title}
          </AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className="max-w-[320px] text-body-regular text-gray-500">
              {description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex-row justify-stretch gap-3 sm:flex-row sm:justify-stretch">
          <AlertDialogCancel
            disabled={loading}
            className={cn(
              'mt-0 h-11 flex-1 rounded-xl border border-gray-200 bg-white',
              'text-body-medium text-foreground shadow-none',
              'hover:bg-gray-50 focus-visible:ring-gray-200'
            )}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={cn(
              'h-11 flex-1 rounded-xl border-0 text-body-medium shadow-none',
              isDestructive
                ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={handleConfirm}
          >
            {loading ? 'Please wait…' : resolvedConfirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
