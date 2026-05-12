import { API_ENDPOINTS } from '@/constants';
import { normalizeUser, type UserInbound } from '@/services/auth/authService';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  User,
} from '@/types/auth/auth';
import apiClient from '@/utils/api';
import { MaybeWrapped, unwrapApiData } from '@/utils/response';

/** Inbound shape from API or legacy mocks (`state` / `zipCode`). */
export type AddressInbound = Address & {
  state?: string | null;
  zipCode?: string | null;
};

export function normalizeAddress(raw: AddressInbound): Address {
  const district = raw.district ?? raw.state ?? null;
  const postalCode = raw.postalCode ?? raw.zipCode ?? null;
  const now = new Date().toISOString();

  return {
    ...raw,
    addressLine2: raw.addressLine2 ?? null,
    district,
    ward: raw.ward ?? null,
    postalCode,
    country: raw.country ?? 'Vietnam',
    addressType: raw.addressType ?? 'SHIPPING',
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? null,
  };
}

const normalizeAddressList = (list: AddressInbound[]): Address[] =>
  list.map(normalizeAddress);

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<MaybeWrapped<User>>(API_ENDPOINTS.USER.PROFILE);
    const data = unwrapApiData(response);
    return normalizeUser(data as UserInbound);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<MaybeWrapped<User>>(
      API_ENDPOINTS.USER.PROFILE,
      data
    );
    const payload = unwrapApiData(response);
    return normalizeUser(payload as UserInbound);
  },

  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<MaybeWrapped<AddressInbound[]>>(
      API_ENDPOINTS.USER.ADDRESSES
    );
    const list = unwrapApiData(response) ?? [];
    return normalizeAddressList(Array.isArray(list) ? list : []);
  },

  getAddressById: async (id: string): Promise<Address> => {
    const response = await apiClient.get<MaybeWrapped<AddressInbound>>(
      API_ENDPOINTS.USER.ADDRESS_DETAIL(id)
    );
    return normalizeAddress(unwrapApiData(response) as AddressInbound);
  },

  getDefaultAddress: async (): Promise<Address> => {
    const response = await apiClient.get<MaybeWrapped<AddressInbound>>(
      API_ENDPOINTS.USER.ADDRESS_DEFAULT
    );
    return normalizeAddress(unwrapApiData(response) as AddressInbound);
  },

  createAddress: async (body: CreateAddressRequest): Promise<Address> => {
    const response = await apiClient.post<MaybeWrapped<AddressInbound>>(
      API_ENDPOINTS.USER.ADDRESSES,
      body
    );
    return normalizeAddress(unwrapApiData(response) as AddressInbound);
  },

  updateAddress: async (id: string, body: UpdateAddressRequest): Promise<Address> => {
    const response = await apiClient.put<MaybeWrapped<AddressInbound>>(
      API_ENDPOINTS.USER.ADDRESS_DETAIL(id),
      body
    );
    return normalizeAddress(unwrapApiData(response) as AddressInbound);
  },

  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await apiClient.put<MaybeWrapped<AddressInbound>>(
      API_ENDPOINTS.USER.ADDRESS_SET_DEFAULT(id)
    );
    return normalizeAddress(unwrapApiData(response) as AddressInbound);
  },

  deleteAddress: async (id: string): Promise<void> => {
    const response = await apiClient.delete<MaybeWrapped<null>>(
      API_ENDPOINTS.USER.ADDRESS_DETAIL(id)
    );
    unwrapApiData(response);
  },
};
