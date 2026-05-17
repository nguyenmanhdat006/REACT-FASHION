export type AdminEntityPanelMode = 'create' | 'edit';

export type AdminEntityPanelState =
  | { open: false }
  | { open: true; mode: AdminEntityPanelMode; entityId?: string };

export function adminEntityPanelTitle(
  resourceLabel: string,
  panel: AdminEntityPanelState,
): string | undefined {
  if (!panel.open) return undefined;
  return panel.mode === 'create'
    ? `Create ${resourceLabel}`
    : `Edit ${resourceLabel}`;
}
