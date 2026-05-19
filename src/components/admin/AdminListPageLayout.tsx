import { useCallback, type JSX, type ReactNode } from 'react';

import { AdminListToolbar } from '@/components/admin/AdminListToolbar';
import AdminEntitySidePanel from '@/components/admin/AdminEntitySidePanel';
import AdminFormFooter from '@/components/admin/AdminFormFooter';
import {
  adminEntityPanelSubmitLabel,
  adminEntityPanelTitle,
  type AdminEntityPanelState,
  type AdminEntityPanelSubmitContext,
} from '@/components/admin/types';
import { cn } from '@/lib/utils';

export type AdminListPageLayoutProps = {
  resourceLabel: string;
  panel: AdminEntityPanelState;
  onPanelChange: (panel: AdminEntityPanelState) => void;

  onFiltersClick?: () => void;
  activeFilterCount?: number;
  filtersAriaLabel?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
  addAriaLabel?: string;
  toolbarExtra?: ReactNode;

  children: ReactNode;
  className?: string;

  panelChildren?: ReactNode;
  panelFooter?: ReactNode;

  onSubmit?: (
    ctx: AdminEntityPanelSubmitContext,
  ) => void | boolean | Promise<void | boolean>;
  formId?: string;
  submitDisabled?: boolean;
  busy?: boolean;
  cancelLabel?: string;

  loading?: boolean;
  error?: string | null;
  loadingMessage?: string;
};

export default function AdminListPageLayout({
  resourceLabel,
  panel,
  onPanelChange,
  onFiltersClick,
  activeFilterCount = 0,
  filtersAriaLabel,
  onAddClick,
  showAddButton = true,
  addAriaLabel,
  toolbarExtra,
  children,
  className,
  panelChildren,
  panelFooter,
  onSubmit,
  formId,
  submitDisabled = false,
  busy = false,
  cancelLabel = 'Cancel',
  loading = false,
  error = null,
  loadingMessage = 'Loading…',
}: AdminListPageLayoutProps): JSX.Element {
  const closePanel = useCallback(() => {
    onPanelChange({ open: false });
  }, [onPanelChange]);

  const handleSubmit = useCallback(async () => {
    if (!onSubmit || !panel.open) return;
    const ctx: AdminEntityPanelSubmitContext = {
      mode: panel.mode,
      entityId: panel.entityId,
    };
    const result = await onSubmit(ctx);
    if (result !== false) {
      closePanel();
    }
  }, [closePanel, onSubmit, panel]);

  const panelTitle = adminEntityPanelTitle(resourceLabel, panel) ?? '';
  const submitLabel = adminEntityPanelSubmitLabel(resourceLabel, panel);

  const defaultFooter = (
    <AdminFormFooter
      formId={formId}
      cancelLabel={cancelLabel}
      submitLabel={submitLabel}
      onCancel={closePanel}
      onSubmit={onSubmit ? () => void handleSubmit() : undefined}
      submitDisabled={submitDisabled}
      busy={busy}
    />
  );

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
      <AdminListToolbar
        onFiltersClick={onFiltersClick}
        activeFilterCount={activeFilterCount}
        filtersAriaLabel={filtersAriaLabel}
        onAddClick={onAddClick}
        showAddButton={showAddButton}
        addAriaLabel={addAriaLabel}
        extra={toolbarExtra}
      />

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
        open={panel.open}
        title={panelTitle}
        onClose={closePanel}
        footer={panelFooter ?? defaultFooter}
      >
        {panelChildren}
      </AdminEntitySidePanel>
    </div>
  );
}
