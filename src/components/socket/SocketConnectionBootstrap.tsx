import type { JSX } from 'react';

import { useSocketConnection } from '@/hooks/socket/useSocketConnection';

import { SocketStatusBadge } from './SocketStatusBadge';

export function SocketConnectionBootstrap(): JSX.Element | null {
  const { status } = useSocketConnection();

  if (import.meta.env.DEV) {
    return <SocketStatusBadge status={status} />;
  }

  return null;
}
