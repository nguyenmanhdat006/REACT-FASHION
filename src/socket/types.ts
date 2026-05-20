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

export type SocketStatusListener = (status: SocketConnectionStatus, detail?: string) => void;
