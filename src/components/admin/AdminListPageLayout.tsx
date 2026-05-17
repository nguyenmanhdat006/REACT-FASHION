import { Plus } from 'lucide-react';
import { useCallback, type JSX, type ReactNode } from 'react';

import AdminEntitySidePanel from '@/components/admin/AdminEntitySidePanel';
import AdminFormFooter from '@/components/admin/AdminFormFooter';
import {
  adminEntityPanelSubmitLabel,
  adminEntityPanelTitle,
  type AdminEntityPanelState,
  type AdminEntityPanelSubmitContext,
} from '@/components/admin/types';
import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { cn } from '@/lib/utils';

export type AdminListPageLayoutProps = {
  resourceLabel: string;
  panel: AdminEntityPanelState;
  onPanelChange: (panel: AdminEntityPanelState) => void;

  onFiltersClick?: () => void;
  onAddClick: () => void;
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
  onAddClick,
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
