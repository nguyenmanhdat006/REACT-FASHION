import { Plus } from 'lucide-react';
import type { JSX, ReactNode } from 'react';

import AdminEntitySidePanel from '@/components/admin/AdminEntitySidePanel';
import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { cn } from '@/lib/utils';

export type AdminListPageLayoutProps = {
  onFiltersClick?: () => void;
  onAddClick: () => void;
  toolbarExtra?: ReactNode;

  children: ReactNode;
  className?: string;

  panelOpen: boolean;
  panelTitle: string;
  onPanelClose: () => void;
  panelChildren?: ReactNode;
  panelFooter?: ReactNode;

  loading?: boolean;
  error?: string | null;
  loadingMessage?: string;
};

export default function AdminListPageLayout({
  onFiltersClick,
  onAddClick,
  toolbarExtra,
  children,
  className,
  panelOpen,
  panelTitle,
  onPanelClose,
  panelChildren,
  panelFooter,
  loading = false,
  error = null,
  loadingMessage = 'Loading…',
}: AdminListPageLayoutProps): JSX.Element {
  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton
          label="Filters"
          type="button"
          tone="default"
          className="bg-gray-white hover:bg-gray-100"
          onClick={onFiltersClick}
        />
        <IconButton
          icon={Plus}
          ariaLabel="Add"
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90"
          iconClassName="text-white"
        />
        {toolbarExtra}
      </div>

      {children}

      {loading ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          {loadingMessage}
        </p>
      ) : null}
      {error && !loading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {error}
        </p>
      ) : null}

      <AdminEntitySidePanel
        open={panelOpen}
        title={panelTitle}
        onClose={onPanelClose}
        footer={panelFooter}
      >
        {panelChildren}
      </AdminEntitySidePanel>
    </div>
  );
}
