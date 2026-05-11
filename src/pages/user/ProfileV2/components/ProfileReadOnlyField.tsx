import type { LucideIcon } from 'lucide-react';
import type { JSX } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type ProfileReadOnlyFieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
};

export function ProfileReadOnlyField({
  id,
  label,
  icon: Icon,
  value,
}: ProfileReadOnlyFieldProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-caption-lg-regular font-normal text-gray-500"
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <Input
          id={id}
          readOnly
          value={value}
          className={cn(
            'h-11 border-0 bg-gray-50 pl-11 text-body-regular text-gray-800',
            'shadow-none focus-visible:ring-0 dark:bg-input/30',
          )}
        />
      </div>
    </div>
  );
}
