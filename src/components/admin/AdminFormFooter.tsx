import type { JSX } from 'react';

import { Button } from '@/components/ui/button';

export type AdminFormFooterProps = {
  formId?: string;
  cancelLabel?: string;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  busy?: boolean;
};

export default function AdminFormFooter({
  formId,
  cancelLabel = 'Cancel',
  submitLabel = 'Save changes',
  onCancel,
  onSubmit,
  submitDisabled = false,
  busy = false,
}: AdminFormFooterProps): JSX.Element {
  const useFormSubmit = Boolean(formId);

  return (
    <>
      <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
        {cancelLabel}
      </Button>
      <Button
        type={useFormSubmit ? 'submit' : 'button'}
        form={useFormSubmit ? formId : undefined}
        disabled={submitDisabled || busy}
        onClick={useFormSubmit ? undefined : onSubmit}
      >
        {submitLabel}
      </Button>
    </>
  );
}
