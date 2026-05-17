import type { JSX } from 'react';

import { Button } from '@/components/ui/button';

export type AdminFormFooterProps = {
  formId?: string;
  cancelLabel?: string;
  submitLabel?: string;
  onCancel: () => void;
  submitDisabled?: boolean;
  busy?: boolean;
};

export default function AdminFormFooter({
  formId,
  cancelLabel = 'Cancel',
  submitLabel = 'Save changes',
  onCancel,
  submitDisabled = false,
  busy = false,
}: AdminFormFooterProps): JSX.Element {
  return (
    <>
      <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        form={formId}
        disabled={submitDisabled || busy}
      >
        {submitLabel}
      </Button>
    </>
  );
}
