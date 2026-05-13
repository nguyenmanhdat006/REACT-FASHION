import { ApiResponse } from '@/types/common/common';

export type MaybeWrapped<T> = ApiResponse<T> | T;

export const unwrapApiData = <T>(response: MaybeWrapped<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

export const unwrapApiSuccess = <T>(body: MaybeWrapped<T>): T => {
  if (body && typeof body === 'object' && 'success' in body) {
    const envelope = body as ApiResponse<T>;
    if (envelope.success === false) {
      const msg =
        (typeof envelope.error === 'string' && envelope.error.trim()) ||
        envelope.message?.trim() ||
        'Request failed';
      throw new Error(msg);
    }
    return envelope.data as T;
  }

  return unwrapApiData(body);
};
