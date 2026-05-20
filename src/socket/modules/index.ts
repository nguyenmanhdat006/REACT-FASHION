import { chatModule } from './chatModule';
import { notificationModule } from './notificationModule';
import type { SocketModule } from './types';

/** All domain modules registered on the single shared socket connection. */
export const SOCKET_MODULES: SocketModule[] = [chatModule, notificationModule];

export { chatModule } from './chatModule';
export { notificationModule } from './notificationModule';
export type { SocketModule } from './types';
export type { MessageRealtimePayload } from './chatModule';
export type { NotificationRealtimePayload } from './notificationModule';
