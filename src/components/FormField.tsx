import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  type: 'email' | 'password' | 'text';
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
  showPassword?: boolean;
  onPasswordToggle?: () => void;
}

const labelClass = 'text-black text-body-regular font-normal';
const inputClass = 'h-14 rounded-2xl border-secondary-900 px-4 text-body-regular placeholder:text-gray-500 w-full';

export function FormField({
  id,
  label,
  type,
  placeholder,
  register,
  error,
  autoComplete,
  showPassword,
  onPasswordToggle,
}: FormFieldProps) {
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
              hasError && 'border-red-500 ring-1 ring-red-500'
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
            hasError && 'border-red-500 ring-1 ring-red-500'
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
