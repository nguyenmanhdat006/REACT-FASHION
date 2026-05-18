import { X } from 'lucide-react';
import { useEffect, type JSX, type ReactNode } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { cn } from '@/lib/utils';

export type AdminEntitySidePanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  overlayClassName?: string;
};

export default function AdminEntitySidePanel({
  open,
  title,
  onClose,
  children,
  footer,
  className,
  overlayClassName,
}: AdminEntitySidePanelProps): JSX.Element | null {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={cn('fixed inset-0 z-40 bg-black/20', overlayClassName)}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-lg',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-entity-panel-title"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="admin-entity-panel-title"
            className="text-h5-medium text-gray-black"
          >
            {title}
          </h2>
          <IconButton
            icon={X}
            ariaLabel="Close panel"
            onClick={onClose}
            className="size-9 shrink-0 rounded-full p-2 hover:bg-gray-100"
            iconClassName="size-5 text-gray-700"
          />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-hide">
          {children}
        </div>

        {footer ? (
          <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-100 px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </aside>
    </>
  );
}
