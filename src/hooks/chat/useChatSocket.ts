import { useEffect, useState } from 'react';

import {
  connectChatSocket,
  disconnectChatSocket,
  subscribeSocketStatus,
  type SocketConnectionStatus,
} from '@/lib/socket/chatSocket';
import { useAppSelector } from '@/store/hooks';

export function useChatSocket(): { status: SocketConnectionStatus } {
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [status, setStatus] = useState<SocketConnectionStatus>('idle');

  useEffect(() => subscribeSocketStatus(setStatus), []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectChatSocket();
      return;
    }

    connectChatSocket(accessToken);
  }, [isAuthenticated, accessToken]);

  return { status };
}
