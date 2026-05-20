export type ConversationType = 'DIRECT' | 'SUPPORT';

export interface ConversationInbound {
  id: number;
  type: ConversationType;
  supportCustomerUserId: string | null;
  claimed: boolean;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  participantUserIds: string[];
}

export interface MessageInbound {
  id: string;
  conversationId: number;
  senderId: string;
  content: string;
  clientMessageId: string | null;
  createdAt: string | null;
}

export interface SendMessagePayload {
  conversationId: number;
  content: string;
  clientMessageId?: string | null;
}

export interface MessagePageInbound {
  content: MessageInbound[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
  first?: boolean;
}
