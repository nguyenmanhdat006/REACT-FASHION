import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@/store/hooks';
import {
  createAddressThunk,
  deleteAddressThunk,
  fetchAddressesThunk,
  fetchProfileThunk,
  setDefaultAddressThunk,
  updateAddressThunk,
  updateProfileThunk,
} from '@/store/thunks';
import type {
  CreateAddressRequest,
  UpdateAddressRequest,
  User,
} from '@/types/auth/auth';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useProfile() {
  const dispatch = useAppDispatch();

  const fetchProfile = useCallback(async () => {
    const result = await dispatch(fetchProfileThunk());
    if (fetchProfileThunk.rejected.match(result)) {
      toast.error(
        payloadMessage(result.payload, 'Could not load profile')
      );
    }
  }, [dispatch]);

  const fetchAddresses = useCallback(async () => {
    const result = await dispatch(fetchAddressesThunk());
    if (fetchAddressesThunk.rejected.match(result)) {
      toast.error(
        payloadMessage(result.payload, 'Could not load addresses')
      );
    }
  }, [dispatch]);

  const updateProfile = useCallback(
    async (body: Partial<User>): Promise<boolean> => {
      const result = await dispatch(updateProfileThunk(body));
      if (updateProfileThunk.fulfilled.match(result)) {
        toast.success('Profile updated');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not update profile'));
      return false;
    },
    [dispatch]
  );

  const createAddress = useCallback(
    async (payload: CreateAddressRequest): Promise<boolean> => {
      const result = await dispatch(createAddressThunk(payload));
      if (createAddressThunk.fulfilled.match(result)) {
        toast.success('Address created');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not save address'));
      return false;
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    async (id: string, body: UpdateAddressRequest): Promise<boolean> => {
      const result = await dispatch(updateAddressThunk({ id, body }));
      if (updateAddressThunk.fulfilled.match(result)) {
        toast.success('Address updated');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not save address'));
      return false;
    },
    [dispatch]
  );

  const setDefaultAddress = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(setDefaultAddressThunk(id));
      if (setDefaultAddressThunk.fulfilled.match(result)) {
        toast.success('Default address updated');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not set default'));
      return false;
    },
    [dispatch]
  );

  const deleteAddress = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteAddressThunk(id));
      if (deleteAddressThunk.fulfilled.match(result)) {
        toast.success('Address deleted');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Could not delete address'));
      return false;
    },
    [dispatch]
  );

  return {
    fetchProfile,
    fetchAddresses,
    updateProfile,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
  };
}
