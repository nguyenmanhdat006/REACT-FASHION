import { X } from 'lucide-react';
import { useEffect, useState, type JSX, type ReactNode } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { cn } from '@/lib/utils';

const PANEL_TRANSITION_MS = 300;

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
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), PANEL_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted, onClose]);

  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        className={cn(
          'fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ease-out',
          visible ? 'opacity-100' : 'opacity-0',
          overlayClassName,
        )}
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-lg',
          'transition-transform duration-300 ease-out will-change-transform',
          visible ? 'translate-x-0' : 'translate-x-full',
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
