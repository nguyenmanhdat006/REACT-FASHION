import { createAsyncThunk } from '@reduxjs/toolkit';

import { chatService } from '@/services/chat/chatService';
import type { ApiResponse, ListQueryParams } from '@/types/common/common';
import type { ConversationInbound, MessagePageInbound } from '@/types/chat/chat';
import { apiFailureMessage } from '@/utils/apiEnvelope';

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
  fallback;

export const fetchSupportQueueThunk = createAsyncThunk<
  ApiResponse<ConversationInbound[]>,
  void,
  { rejectValue: string }
>('chat/fetchSupportQueue', async (_, { rejectWithValue }) => {
  try {
    const res = await chatService.getSupportQueue();
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load support queue'));
  }
});

export const fetchMyConversationsThunk = createAsyncThunk<
  ApiResponse<ConversationInbound[]>,
  void,
  { rejectValue: string }
>('chat/fetchMyConversations', async (_, { rejectWithValue }) => {
  try {
    const res = await chatService.getMyConversations();
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load conversations'));
  }
});

export const fetchConversationMessagesThunk = createAsyncThunk<
  ApiResponse<MessagePageInbound>,
  { conversationId: number; params?: ListQueryParams },
  { rejectValue: string }
>('chat/fetchConversationMessages', async ({ conversationId, params }, { rejectWithValue }) => {
  try {
    const res = await chatService.listMessages(conversationId, params);
    if (!res.success) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load messages'));
  }
});

export const claimConversationThunk = createAsyncThunk<
  ApiResponse<ConversationInbound>,
  number,
  { rejectValue: string }
>('chat/claimConversation', async (conversationId, { rejectWithValue }) => {
  try {
    const res = await chatService.claimConversation(conversationId);
    if (!res.success || !res.data) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to claim conversation'));
  }
});

export const fetchConversationDetailThunk = createAsyncThunk<
  ApiResponse<ConversationInbound>,
  number,
  { rejectValue: string }
>('chat/fetchConversationDetail', async (conversationId, { rejectWithValue }) => {
  try {
    const res = await chatService.getConversation(conversationId);
    if (!res.success || !res.data) return rejectWithValue(apiFailureMessage(res));
    return res;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Failed to load conversation'));
  }
});
