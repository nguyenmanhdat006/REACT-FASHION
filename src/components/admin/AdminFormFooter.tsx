import type { JSX } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';

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

  const footerButtonClass = 'rounded-2xl px-5 py-2.5';

  return (
    <>
      <LabelButton
        type="button"
        label={cancelLabel}
        tone="default"
        disabled={busy}
        onClick={onCancel}
        className={footerButtonClass}
      />
      <LabelButton
        type={useFormSubmit ? 'submit' : 'button'}
        form={useFormSubmit ? formId : undefined}
        label={submitLabel}
        tone="primary"
        disabled={submitDisabled || busy}
        onClick={useFormSubmit ? undefined : onSubmit}
        className={footerButtonClass}
      />
    </>
  );
}
