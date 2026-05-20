import { useEffect, useState } from 'react';

import {
  connectSocket,
  disconnectSocket,
  subscribeSocketStatus,
  type SocketConnectionStatus,
} from '@/socket';
import { useAppSelector } from '@/store/hooks';

export function useSocketConnection(): { status: SocketConnectionStatus } {
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [status, setStatus] = useState<SocketConnectionStatus>('idle');

  useEffect(() => subscribeSocketStatus(setStatus), []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    connectSocket(accessToken);
  }, [isAuthenticated, accessToken]);

  return { status };
}
