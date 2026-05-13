import { API_ENDPOINTS } from '@/constants';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  User,
} from '@/types/auth/auth';
import type { ApiResponse } from '@/types/common/common';
import apiClient from '@/utils/api';

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

export const normalizeAddressList = (list: AddressInbound[]): Address[] =>
  list.map(normalizeAddress);

export const userService = {
  getProfile: (): Promise<ApiResponse<User>> =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.put<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE, data),

  getAddresses: (): Promise<ApiResponse<AddressInbound[]>> =>
    apiClient.get<ApiResponse<AddressInbound[]>>(API_ENDPOINTS.USER.ADDRESSES),

  getAddressById: (id: string): Promise<ApiResponse<AddressInbound>> =>
    apiClient.get<ApiResponse<AddressInbound>>(API_ENDPOINTS.USER.ADDRESS_DETAIL(id)),

  getDefaultAddress: (): Promise<ApiResponse<AddressInbound>> =>
    apiClient.get<ApiResponse<AddressInbound>>(API_ENDPOINTS.USER.ADDRESS_DEFAULT),

  createAddress: (body: CreateAddressRequest): Promise<ApiResponse<AddressInbound>> =>
    apiClient.post<ApiResponse<AddressInbound>>(API_ENDPOINTS.USER.ADDRESSES, body),

  updateAddress: (
    id: string,
    body: UpdateAddressRequest
  ): Promise<ApiResponse<AddressInbound>> =>
    apiClient.put<ApiResponse<AddressInbound>>(API_ENDPOINTS.USER.ADDRESS_DETAIL(id), body),

  setDefaultAddress: (id: string): Promise<ApiResponse<AddressInbound>> =>
    apiClient.put<ApiResponse<AddressInbound>>(API_ENDPOINTS.USER.ADDRESS_SET_DEFAULT(id)),

  deleteAddress: (id: string): Promise<ApiResponse<null>> =>
    apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.USER.ADDRESS_DETAIL(id)),
};
