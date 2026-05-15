import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { fetchUsersThunk, updateUserRolesThunk } from '@/store/thunks';
import { useAppDispatch } from '@/store/hooks';
import type { PaginationParams } from '@/types/common/common';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useAdminUsers() {
  const dispatch = useAppDispatch();

  const fetchUsersPage = useCallback(
    async (params: PaginationParams) => {
      const result = await dispatch(fetchUsersThunk(params));
      if (fetchUsersThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Could not load users'));
      }
    },
    [dispatch],
  );

  const updateUserRoles = useCallback(
    async (
      id: string,
      roles: string[],
      refetchParams: PaginationParams,
    ): Promise<boolean> => {
      const result = await dispatch(updateUserRolesThunk({ id, roles }));
      if (updateUserRolesThunk.fulfilled.match(result)) {
        toast.success('User roles updated');
        await dispatch(fetchUsersThunk(refetchParams));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not update user roles'));
      return false;
    },
    [dispatch],
  );

  return {
    fetchUsersPage,
    updateUserRoles,
  };
}
