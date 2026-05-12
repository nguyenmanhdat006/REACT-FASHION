import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const labelClass = 'text-body-regular font-normal text-foreground';
const inputClass =
  'h-14 rounded-2xl border border-secondary-500 px-4 text-body-regular placeholder:text-gray-500 w-full dark:bg-input/30 focus-visible:border-secondary-500 focus-visible:ring-2 focus-visible:ring-secondary-500/30';

const selectTriggerFieldClass =
  'flex h-14 min-h-14 w-full min-w-0 items-center justify-between gap-2 border bg-transparent py-0 shadow-none outline-none transition-colors focus-visible:border-secondary-500 focus-visible:ring-2 focus-visible:ring-secondary-500/30 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-14 data-[size=default]:min-h-14 data-placeholder:text-gray-500 [&_svg]:size-5 [&_svg]:text-gray-500';

const inputErrorClass =
  'border-red-500 ring-1 ring-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/35';

export type SelectOption = { value: string; label: string };

type FormFieldBase = {
  id: string;
  label: string;
  error?: FieldError;
};

export type FormFieldInputProps = FormFieldBase & {
  variant?: 'input';
  type: 'email' | 'password' | 'text';
  placeholder: string;
  register: UseFormRegisterReturn;
  autoComplete?: string;
  showPassword?: boolean;
  onPasswordToggle?: () => void;
};

export type FormFieldParagraphProps = FormFieldBase & {
  variant: 'paragraph';
  placeholder: string;
  register: UseFormRegisterReturn;
  rows?: number;
};

export type FormFieldSelectionProps = FormFieldBase & {
  variant: 'selection';
  placeholder: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export type FormFieldProps = FormFieldInputProps | FormFieldParagraphProps | FormFieldSelectionProps;

export function FormField(props: FormFieldProps) {
  if (props.variant === 'paragraph') {
    const { id, label, placeholder, register, error, rows = 5 } = props;
    const hasError = !!error;
    return (
      <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
        <Label htmlFor={id} className={labelClass}>
          {label}
        </Label>
        <Textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            inputClass,
            'min-h-[140px] resize-y py-3',
            hasError && inputErrorClass
          )}
          {...register}
        />
        {error && (
          <span className="text-red-500 text-caption-lg-regular">{error.message}</span>
        )}
      </div>
    );
  }

  if (props.variant === 'selection') {
    const { id, label, placeholder, options, value, onValueChange, error, disabled } = props;
    const hasError = !!error;
    return (
      <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
        <Label htmlFor={id} className={labelClass}>
          {label}
        </Label>
        <Select
          value={value || undefined}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            aria-invalid={hasError}
            className={cn(
              inputClass,
              selectTriggerFieldClass,
              hasError && inputErrorClass
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            sideOffset={6}
            className="z-[100] rounded-2xl border border-secondary-500 shadow-lg ring-border dark:border-secondary-500"
          >
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={cn(
                  'rounded-lg py-2 pl-2 text-body-regular',
                  'focus:bg-secondary-100 focus:text-gray-900',
                  'data-[highlighted]:bg-secondary-100 data-[highlighted]:text-gray-900',
                  'dark:focus:bg-secondary-900/35 dark:data-[highlighted]:bg-secondary-900/35 dark:focus:text-gray-100 dark:data-[highlighted]:text-gray-100'
                )}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <span className="text-red-500 text-caption-lg-regular">{error.message}</span>
        )}
      </div>
    );
  }

  const {
    id,
    label,
    type,
    placeholder,
    register,
    error,
    autoComplete,
    showPassword,
    onPasswordToggle,
  } = props;
  const isPassword = type === 'password';
  const hasError = !!error;

  return (
    <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>

      {isPassword ? (
        <div className="relative w-full">
          <Input
            id={id}
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={cn(
              inputClass,
              'pl-4 pr-12',
              hasError && inputErrorClass
            )}
            {...register}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onClick={onPasswordToggle}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
      ) : (
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            inputClass,
            hasError && inputErrorClass
          )}
          {...register}
        />
      )}

      {error && (
        <span className="text-red-500 text-caption-lg-regular">
          {error.message}
        </span>
      )}
    </div>
  );
}
