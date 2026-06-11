import type { ConversationInbound, MessageInbound } from '@/types/chat/chat';
import {
  buildSeedChatConversations,
  buildSeedChatMessages,
} from '@/mocks/storage/mockState';

export const MOCK_CHAT_CONVERSATIONS: ConversationInbound[] = buildSeedChatConversations();

export const MOCK_CHAT_MESSAGES: Record<string, MessageInbound[]> = buildSeedChatMessages();
