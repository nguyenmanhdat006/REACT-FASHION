import { useMemo } from 'react';

import { useAppSelector } from '@/store/hooks';
import { getSubjectFromJwtToken } from '@/utils/jwt';

/** Chat identity (JWT `sub`), not the user-service database UUID. */
export function useChatUserId(): string | null {
  const accessToken = useAppSelector(state => state.auth.accessToken);
  return useMemo(
    () => getSubjectFromJwtToken(accessToken ?? undefined),
    [accessToken],
  );
}
