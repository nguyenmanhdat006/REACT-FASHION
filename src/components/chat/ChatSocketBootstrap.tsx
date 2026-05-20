import type { JSX } from 'react';

import { useChatSocket } from '@/hooks/chat/useChatSocket';

import { SocketStatusBadge } from './SocketStatusBadge';

export function ChatSocketBootstrap(): JSX.Element | null {
  const { status } = useChatSocket();

  if (import.meta.env.DEV) {
    return <SocketStatusBadge status={status} />;
  }

  return null;
}
