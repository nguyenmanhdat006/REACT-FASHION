export {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeSocketStatus,
} from './socketClient';

export type {
  SocketConnectedPayload,
  SocketConnectionStatus,
  SocketStatusListener,
} from './types';

export { registerSocketModules, unregisterSocketModules } from './moduleRegistry';

export { SOCKET_MODULES, chatModule, notificationModule } from './modules';

export type { SocketModule } from './modules';
export type { MessageRealtimePayload } from './modules';
export type { NotificationRealtimePayload } from './modules';
