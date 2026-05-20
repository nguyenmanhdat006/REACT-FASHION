import type { SocketModule } from './types';

export type MessageRealtimePayload = {
  messageId?: string;
  conversationId?: number;
  senderId?: string;
  content?: string;
  clientMessageId?: string;
  createdAt?: string;
};

export const chatModule: SocketModule = {
  id: 'chat',
  register(socket) {
    const onMessageNew = (payload: MessageRealtimePayload) => {
      if (import.meta.env.DEV) {
        console.info('[socket:chat] message:new', payload);
      }
    };

    const onMessageCreated = (payload: MessageRealtimePayload) => {
      if (import.meta.env.DEV) {
        console.info('[socket:chat] message:created', payload);
      }
    };

    socket.on('message:new', onMessageNew);
    socket.on('message:created', onMessageCreated);

    return () => {
      socket.off('message:new', onMessageNew);
      socket.off('message:created', onMessageCreated);
    };
  },
};
