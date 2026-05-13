import type { ApiResponse } from '@/types/common/common';

export function apiFailureMessage<T>(body: ApiResponse<T>): string {
  const e = body.error;
  const m = body.message;
  return (
    (typeof e === 'string' && e.trim()) ||
    (typeof m === 'string' && m.trim()) ||
    'Request failed'
  );
}
