import { getSocket } from '@/socket';
import type { MessageInbound, SendMessagePayload } from '@/types/chat/chat';

const SEND_TIMEOUT_MS = 15_000;

type SendMessageAck = {
  ok?: boolean;
  error?: string;
  messageId?: string;
  conversationId?: number;
  clientMessageId?: string;
  createdAt?: string;
};

function parseAckError(ack: unknown): string | null {
  if (!ack || typeof ack !== 'object') {
    return 'Invalid server response';
  }
  const typed = ack as SendMessageAck;
  if (typed.error) {
    return typed.error;
  }
  if (typed.ok === false) {
    return 'Failed to send message';
  }
  return null;
}

function isJoinAckSuccess(ack: unknown): boolean {
  if (ack && typeof ack === 'object' && 'joined' in ack) {
    return Boolean((ack as { joined?: boolean }).joined);
  }
  if (ack && typeof ack === 'object' && 'ok' in ack) {
    return Boolean((ack as { ok?: boolean }).ok);
  }
  return false;
}

export function emitJoinConversation(conversationId: number): Promise<void> {
  const socket = getSocket();
  if (!socket?.connected) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    socket.emit('conversation:join', conversationId, (ack: unknown) => {
      if (isJoinAckSuccess(ack)) {
        resolve();
        return;
      }
      if (ack && typeof ack === 'object' && 'error' in ack) {
        reject(new Error(String((ack as { error?: string }).error)));
        return;
      }
      reject(new Error('Failed to join conversation room'));
    });
  });
}

export function emitSendMessage(
  payload: SendMessagePayload,
  senderId: string,
): Promise<MessageInbound> {
  const socket = getSocket();
  if (!socket?.connected) {
    return Promise.reject(new Error('Socket is not connected'));
  }

  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Send message timed out'));
    }, SEND_TIMEOUT_MS);

    socket.emit(
      'message:send',
      {
        conversationId: payload.conversationId,
        content: payload.content,
        clientMessageId: payload.clientMessageId ?? undefined,
      },
      (ack: unknown) => {
        window.clearTimeout(timeoutId);

        const ackError = parseAckError(ack);
        if (ackError) {
          reject(new Error(ackError));
          return;
        }

        if (!ack || typeof ack !== 'object' || !('messageId' in ack)) {
          reject(new Error('Invalid send acknowledgment'));
          return;
        }

        const typed = ack as SendMessageAck;
        if (!typed.messageId || typed.conversationId == null) {
          reject(new Error('Incomplete send acknowledgment'));
          return;
        }

        resolve({
          id: typed.messageId,
          conversationId: typed.conversationId,
          senderId,
          content: payload.content,
          clientMessageId: typed.clientMessageId?.trim() ? typed.clientMessageId : null,
          createdAt: typed.createdAt ?? null,
        });
      },
    );
  });
}
