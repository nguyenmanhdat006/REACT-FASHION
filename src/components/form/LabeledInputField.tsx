import type { LucideIcon } from 'lucide-react';
import type { ChangeEvent, JSX } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type LabeledInputFieldBase = {
  id: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
  labelClassName?: string;
  error?: string;
};

export type LabeledInputFieldReadonlyProps = LabeledInputFieldBase & {
  mode: 'readonly';
  value: string;
};

export type LabeledInputFieldEditProps = LabeledInputFieldBase & {
  mode: 'edit';
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  inputClassName?: string;
};

export type LabeledInputFieldProps =
  | LabeledInputFieldReadonlyProps
  | LabeledInputFieldEditProps;

export function LabeledInputField(props: LabeledInputFieldProps): JSX.Element {
  const {
    id,
    label,
    icon: Icon,
    className,
    labelClassName,
    error,
  } = props;

  const isEdit = props.mode === 'edit';
  const paddingLeft = Icon ? 'pl-11' : 'pl-3';

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label
        htmlFor={id}
        className={cn(
          'text-caption-lg-regular font-normal text-gray-500',
          labelClassName
        )}
      >
        {label}
      </Label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
        ) : null}
        <Input
          id={id}
          readOnly={!isEdit}
          value={props.value}
          type={isEdit ? props.type : undefined}
          placeholder={isEdit ? props.placeholder : undefined}
          disabled={isEdit ? props.disabled : undefined}
          onChange={isEdit ? props.onChange : undefined}
          onBlur={isEdit ? props.onBlur : undefined}
          className={cn(
            'h-11 border-0 bg-gray-50 text-body-regular text-gray-800 shadow-none focus-visible:ring-0 dark:bg-input/30',
            paddingLeft,
            !isEdit && 'cursor-default',
            isEdit && props.inputClassName,
            error && 'ring-1 ring-destructive'
          )}
        />
      </div>
      {error ? (
        <p className="text-caption-sm-regular text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
