import { Controller } from 'react-hook-form';
import { useEffect, type JSX } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth/auth';
import {
  initialsFromDisplayName,
  resolveProfileDisplayName,
} from '@/utils/displayName';

import { ADMIN_USER_ROLE_OPTIONS } from './constants';
import type { AdminUserV2FormMode } from './types';
import { useAdminUserV2Form } from './hooks/useAdminUserV2Form';

export const ADMIN_USER_V2_FORM_ID = 'admin-user-v2-form';

export type AdminUserV2FormProps = {
  mode: AdminUserV2FormMode;
  userId?: string;
  formId?: string;
  onSuccess?: () => void;
  onBusyChange?: (busy: boolean) => void;
  className?: string;
};

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map(part => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

function UserSummaryCard({ user }: { user: User }): JSX.Element {
  return (
    <Card className="gap-4 overflow-hidden rounded-2xl bg-white p-4">
      <CardContent className="flex flex-col gap-3 p-0">
        <UserSummaryFields user={user} />
      </CardContent>
    </Card>
  );
}

function UserSummaryFields({ user }: { user: User }): JSX.Element {
  const avatarUrl = user.avatarUrl?.trim() || null;
  const avatarInitials = initialsFromDisplayName(
    resolveProfileDisplayName(user.fullName, user.email),
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" loading="lazy" /> : null}
          <AvatarFallback className="bg-gray-100 text-caption-lg-semibold uppercase text-gray-700">
            {avatarInitials || '—'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-body-medium text-foreground">{user.fullName}</p>
          <p className="text-caption-sm-regular text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="grid gap-2 text-caption-lg-regular text-gray-700">
        <p>
          <span className="text-muted-foreground">Phone: </span>
          {user.phone?.trim() || '—'}
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Status: </span>
          <Badge variant="outline" className="rounded-sm text-caption-sm-regular">
            {formatEnumLabel(user.status?.trim() || 'ACTIVE')}
          </Badge>
        </p>
      </div>
    </>
  );
}

export default function AdminUserV2Form({
  mode,
  userId,
  formId = ADMIN_USER_V2_FORM_ID,
  onSuccess,
  onBusyChange,
  className,
}: AdminUserV2FormProps): JSX.Element {
  const { control, errors, handleSubmit, userDetail, busy } = useAdminUserV2Form({
    mode,
    userId,
    onSuccess,
  });

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  const fieldsDisabled = busy;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className={className ?? 'flex flex-col gap-4'}
    >
      {userDetail ? <UserSummaryCard user={userDetail} /> : null}

      <Card className="gap-4 overflow-hidden rounded-2xl bg-white p-4">
        <CardContent className="flex flex-col gap-3 p-0">
          <p className="text-body-medium text-foreground">Roles</p>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {ADMIN_USER_ROLE_OPTIONS.map(option => {
                  const checked = field.value.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      htmlFor={`user-role-${option.value}`}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2',
                        checked && 'border-primary/40 bg-primary/5',
                        fieldsDisabled && 'cursor-not-allowed opacity-60',
                      )}
                    >
                      <Checkbox
                        id={`user-role-${option.value}`}
                        checked={checked}
                        disabled={fieldsDisabled}
                        onCheckedChange={next => {
                          if (fieldsDisabled) return;
                          const roles = field.value ?? [];
                          if (next === true) {
                            field.onChange([...roles, option.value]);
                          } else {
                            field.onChange(roles.filter(r => r !== option.value));
                          }
                        }}
                      />
                      <span className="text-body-regular text-foreground">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
          {errors.roles ? (
            <p className="text-caption-sm-regular text-destructive">{errors.roles.message}</p>
          ) : null}
        </CardContent>
      </Card>
    </form>
  );
}
