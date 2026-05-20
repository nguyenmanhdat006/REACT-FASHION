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
  isClaiming: false,
  error: null,
};

function supportClaimedMine(c: ConversationInbound): boolean {
  return c.type === 'SUPPORT' && c.claimed;
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
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSupportQueueThunk.pending, state => {
        state.isQueueLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportQueueThunk.fulfilled, (state, action) => {
        state.isQueueLoading = false;
        state.queue = action.payload.data ?? [];
      })
      .addCase(fetchSupportQueueThunk.rejected, (state, action) => {
        state.isQueueLoading = false;
        state.error = (action.payload as string) || 'Failed to load queue';
      })

      .addCase(fetchMyConversationsThunk.pending, state => {
        state.isMyThreadsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyConversationsThunk.fulfilled, (state, action) => {
        state.isMyThreadsLoading = false;
        const list = action.payload.data ?? [];
        state.mySupportThreads = list.filter(supportClaimedMine);
      })
      .addCase(fetchMyConversationsThunk.rejected, (state, action) => {
        state.isMyThreadsLoading = false;
        state.error = (action.payload as string) || 'Failed to load conversations';
      })

      .addCase(fetchConversationMessagesThunk.pending, state => {
        state.isMessagesLoading = true;
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

export const { selectConversation, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;
