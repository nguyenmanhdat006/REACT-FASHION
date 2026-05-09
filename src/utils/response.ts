import { ApiResponse } from '@/types/common/common';

export type MaybeWrapped<T> = ApiResponse<T> | T;

export const unwrapApiData = <T>(response: MaybeWrapped<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};
