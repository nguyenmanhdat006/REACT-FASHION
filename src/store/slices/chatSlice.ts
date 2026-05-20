import { createSlice } from '@reduxjs/toolkit';

import type { PageMeta } from '@/types/common/common';
import type { ConversationInbound, MessageInbound } from '@/types/chat/chat';
import {
  claimConversationThunk,
  fetchConversationMessagesThunk,
  fetchMyConversationsThunk,
  fetchSupportQueueThunk,
} from '@/store/thunks/chatThunks';

interface ChatState {
  queue: ConversationInbound[];
  mySupportThreads: ConversationInbound[];
  selectedConversationId: number | null;
  messages: MessageInbound[];
  messagesMeta: PageMeta | null;
  isQueueLoading: boolean;
  isMyThreadsLoading: boolean;
  isMessagesLoading: boolean;
  hasLoadedQueue: boolean;
  hasLoadedMyThreads: boolean;
  isClaiming: boolean;
  error: string | null;
}

const initialState: ChatState = {
  queue: [],
  mySupportThreads: [],
  selectedConversationId: null,
  messages: [],
  messagesMeta: null,
  isQueueLoading: false,
  isMyThreadsLoading: false,
  isMessagesLoading: false,
  hasLoadedQueue: false,
  hasLoadedMyThreads: false,
  isClaiming: false,
  error: null,
};

function supportClaimedMine(c: ConversationInbound): boolean {
  return c.type === 'SUPPORT' && c.claimed;
}

function moveConversationToTop(
  list: ConversationInbound[],
  conversationId: number,
  patch: Partial<ConversationInbound>,
): ConversationInbound[] {
  const index = list.findIndex(conversation => conversation.id === conversationId);
  if (index === -1) {
    return list;
  }
  const updated = { ...list[index], ...patch };
  return [updated, ...list.filter((_, itemIndex) => itemIndex !== index)];
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation(state, action: { payload: number | null }) {
      state.selectedConversationId = action.payload;
      state.messages = [];
      state.messagesMeta = null;
    },
    appendMessage(state, action: { payload: MessageInbound }) {
      const exists = state.messages.some(message => message.id === action.payload.id);
      if (exists) {
        return;
      }
      state.messages.unshift(action.payload);
    },
    touchConversation(
      state,
      action: {
        payload: {
          conversationId: number;
          lastMessagePreview: string;
          lastMessageAt?: string | null;
        };
      },
    ) {
      const { conversationId, lastMessagePreview, lastMessageAt } = action.payload;
      const patch = {
        lastMessagePreview,
        lastMessageAt: lastMessageAt ?? new Date().toISOString(),
      };
      state.queue = moveConversationToTop(state.queue, conversationId, patch);
      state.mySupportThreads = moveConversationToTop(state.mySupportThreads, conversationId, patch);
    },
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSupportQueueThunk.pending, state => {
        state.isQueueLoading = !state.hasLoadedQueue;
        state.error = null;
      })
      .addCase(fetchSupportQueueThunk.fulfilled, (state, action) => {
        state.isQueueLoading = false;
        state.hasLoadedQueue = true;
        state.queue = action.payload.data ?? [];
      })
      .addCase(fetchSupportQueueThunk.rejected, (state, action) => {
        state.isQueueLoading = false;
        state.error = (action.payload as string) || 'Failed to load queue';
      })

      .addCase(fetchMyConversationsThunk.pending, state => {
        state.isMyThreadsLoading = !state.hasLoadedMyThreads;
        state.error = null;
      })
      .addCase(fetchMyConversationsThunk.fulfilled, (state, action) => {
        state.isMyThreadsLoading = false;
        state.hasLoadedMyThreads = true;
        const list = action.payload.data ?? [];
        state.mySupportThreads = list.filter(supportClaimedMine);
      })
      .addCase(fetchMyConversationsThunk.rejected, (state, action) => {
        state.isMyThreadsLoading = false;
        state.error = (action.payload as string) || 'Failed to load conversations';
      })

      .addCase(fetchConversationMessagesThunk.pending, state => {
        state.isMessagesLoading = state.messages.length === 0;
        state.error = null;
      })
      .addCase(fetchConversationMessagesThunk.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        const page = action.payload.data;
        state.messages = page?.content ?? [];
        state.messagesMeta =
          (action.payload.meta as PageMeta | null | undefined) ?? null;
      })
      .addCase(fetchConversationMessagesThunk.rejected, (state, action) => {
        state.isMessagesLoading = false;
        state.error = (action.payload as string) || 'Failed to load messages';
      })

      .addCase(claimConversationThunk.pending, state => {
        state.isClaiming = true;
        state.error = null;
      })
      .addCase(claimConversationThunk.fulfilled, (state, action) => {
        state.isClaiming = false;
        const conv = action.payload.data;
        if (!conv) {
          return;
        }
        state.queue = state.queue.filter(c => c.id !== conv.id);
        const others = state.mySupportThreads.filter(c => c.id !== conv.id);
        state.mySupportThreads = [conv, ...others];
        state.selectedConversationId = conv.id;
      })
      .addCase(claimConversationThunk.rejected, (state, action) => {
        state.isClaiming = false;
        state.error = (action.payload as string) || 'Failed to claim';
      });
  },
});

export const { selectConversation, appendMessage, touchConversation, clearChatError } =
  chatSlice.actions;
export default chatSlice.reducer;
