import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, ListQueryParams } from '@/types/common/common';
import type {
  ConversationInbound,
  MessageInbound,
  MessagePageInbound,
  SendMessagePayload,
} from '@/types/chat/chat';

export const chatService = {
  getMyConversations(): Promise<ApiResponse<ConversationInbound[]>> {
    return apiClient.get<ApiResponse<ConversationInbound[]>>(API_ENDPOINTS.CHAT.CONVERSATIONS_LIST);
  },

  ensureSupportConversation(): Promise<ApiResponse<ConversationInbound>> {
    return apiClient.post<ApiResponse<ConversationInbound>>(
      API_ENDPOINTS.CHAT.SUPPORT_CONVERSATION,
      {},
    );
  },

  getSupportQueue(): Promise<ApiResponse<ConversationInbound[]>> {
    return apiClient.get<ApiResponse<ConversationInbound[]>>(API_ENDPOINTS.CHAT.SUPPORT_QUEUE);
  },

  claimConversation(conversationId: number): Promise<ApiResponse<ConversationInbound>> {
    return apiClient.post<ApiResponse<ConversationInbound>>(
      API_ENDPOINTS.CHAT.CLAIM_CONVERSATION(conversationId),
    );
  },

  getConversation(conversationId: number): Promise<ApiResponse<ConversationInbound>> {
    return apiClient.get<ApiResponse<ConversationInbound>>(
      API_ENDPOINTS.CHAT.CONVERSATION_DETAIL(conversationId),
    );
  },

  listMessages(
    conversationId: number,
    params?: ListQueryParams,
  ): Promise<ApiResponse<MessagePageInbound>> {
    return apiClient.get<ApiResponse<MessagePageInbound>>(
      API_ENDPOINTS.CHAT.CONVERSATION_MESSAGES(conversationId),
      { params },
    );
  },

  sendMessage(payload: SendMessagePayload): Promise<ApiResponse<MessageInbound>> {
    return apiClient.post<ApiResponse<MessageInbound>>(API_ENDPOINTS.CHAT.SEND_MESSAGE, payload);
  },
};
