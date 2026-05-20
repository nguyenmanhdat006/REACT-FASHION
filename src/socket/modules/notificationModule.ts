import type { SocketModule } from './types';

export type NotificationRealtimePayload = {
  notificationId?: string;
  type?: string;
  title?: string;
  body?: string;
  createdAt?: string;
};

/** Placeholder until SOCKET-GATEWAY exposes notification events. */
export const notificationModule: SocketModule = {
  id: 'notification',
  register(socket) {
    const onNotificationNew = (payload: NotificationRealtimePayload) => {
      if (import.meta.env.DEV) {
        console.info('[socket:notification] notification:new', payload);
      }
    };

    socket.on('notification:new', onNotificationNew);

    return () => {
      socket.off('notification:new', onNotificationNew);
    };
  },
};
