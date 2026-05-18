import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { useAdminUsers } from '@/hooks/user/useAdminUsers';
import { useAppSelector } from '@/store/hooks';

import { adminUserFormToRolesRequest, userToAdminUserFormValues } from '../mapper';
import { adminUserSubmitSchema, emptyAdminUserFormValues } from '../schema';
import type { AdminUserV2FormMode, AdminUserV2FormValues } from '../types';

export type UseAdminUserV2FormOptions = {
  mode: AdminUserV2FormMode;
  userId?: string;
  onSuccess?: () => void;
};

export function useAdminUserV2Form({ mode, userId, onSuccess }: UseAdminUserV2FormOptions) {
  const { fetchUserById, clearUserDetailState, updateUserRoles } = useAdminUsers();
  const { userDetail, userDetailLoading } = useAppSelector(s => s.user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminUserV2FormValues>({
    resolver: zodResolver(adminUserSubmitSchema),
    defaultValues: emptyAdminUserFormValues(),
    mode: 'onSubmit',
  });

  const { control, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (!userId) {
      clearUserDetailState();
      reset(emptyAdminUserFormValues());
      return;
    }
    void fetchUserById(userId);
  }, [userId, fetchUserById, clearUserDetailState, reset]);

  useEffect(() => {
    if (!userId || !userDetail || userDetail.id !== userId) {
      return;
    }
    reset(userToAdminUserFormValues(userDetail));
  }, [userId, userDetail, reset]);

  const onSubmit = useCallback(
    async (values: AdminUserV2FormValues) => {
      if (!userId) {
        toast.error('User id is missing');
        return;
      }
      setIsSubmitting(true);
      const ok = await updateUserRoles(userId, adminUserFormToRolesRequest(values));
      setIsSubmitting(false);
      if (ok) onSuccess?.();
    },
    [userId, updateUserRoles, onSuccess],
  );

  const busy = isSubmitting || userDetailLoading;

  return {
    mode,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    userDetail,
    busy,
  };
}
