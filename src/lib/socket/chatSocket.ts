import { io, type Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/constants';

export type SocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type SocketConnectedPayload = {
  userId?: string;
  sessionId?: string;
  room?: string;
};

type StatusListener = (status: SocketConnectionStatus, detail?: string) => void;

let socket: Socket | null = null;
let currentToken: string | null = null;
const statusListeners = new Set<StatusListener>();

function notify(status: SocketConnectionStatus, detail?: string): void {
  statusListeners.forEach(listener => listener(status, detail));
}

export function subscribeSocketStatus(listener: StatusListener): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getChatSocket(): Socket | null {
  return socket;
}

export function connectChatSocket(accessToken: string): Socket {
  if (socket?.connected && currentToken === accessToken) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentToken = accessToken;
  notify('connecting');

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    transports: ['websocket', 'polling'],
    auth: { token: accessToken },
    query: { token: accessToken },
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  socket.on('connect', () => {
    notify('connected');
  });

  socket.on('disconnect', reason => {
    notify('disconnected', reason);
  });

  socket.on('connect_error', err => {
    notify('error', err.message);
  });

  socket.on('connected', (payload: SocketConnectedPayload) => {
    if (import.meta.env.DEV) {
      console.info('[socket] connected event', payload);
    }
  });

  return socket;
}

export function disconnectChatSocket(): void {
  currentToken = null;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  notify('disconnected');
}
