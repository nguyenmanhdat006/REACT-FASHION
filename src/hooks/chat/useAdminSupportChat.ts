import { useCallback, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useStore } from 'react-redux';

import { getSocket } from '@/socket';
import { emitJoinConversation, emitSendMessage } from '@/services/chat/chatSocketService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import {
  claimConversationThunk,
  fetchConversationMessagesThunk,
  fetchMyConversationsThunk,
  fetchSupportQueueThunk,
} from '@/store/thunks/chatThunks';
import {
  appendMessage,
  clearChatError,
  selectConversation as selectConversationAction,
  touchConversation,
} from '@/store/slices/chatSlice';
import type { MessageInbound } from '@/types/chat/chat';
import type { MessageRealtimePayload } from '@/socket/modules/chatModule';
import { useChatUserId } from '@/hooks/chat/useChatUserId';
import { useSocketConnection } from '@/hooks/socket/useSocketConnection';

const MESSAGE_LIST_PARAMS = {
  page: 0,
  size: 50,
  sortBy: 'createdAt',
  sortDirection: 'desc' as const,
};

function messageFromRealtimePayload(
  payload: MessageRealtimePayload,
  conversationId: number,
): MessageInbound | null {
  if (!payload.messageId || !payload.content) {
    return null;
  }
  return {
    id: payload.messageId,
    conversationId,
    senderId: payload.senderId ?? '',
    content: payload.content,
    clientMessageId: payload.clientMessageId?.trim() ? payload.clientMessageId : null,
    createdAt: payload.createdAt ?? null,
  };
}

export function useAdminSupportChat() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const {
    queue,
    mySupportThreads,
    selectedConversationId,
    messages,
    isQueueLoading,
    isMyThreadsLoading,
    isMessagesLoading,
    isClaiming,
    error,
  } = useAppSelector(state => state.chat);
  const currentUserId = useChatUserId();
  const { status: socketStatus } = useSocketConnection();

  const selectedConversation = useMemo(() => {
    if (selectedConversationId == null) {
      return null;
    }
    const merged = [...queue, ...mySupportThreads];
    return merged.find(c => c.id === selectedConversationId) ?? null;
  }, [queue, mySupportThreads, selectedConversationId]);

  const lastJoinedId = useRef<number | null>(null);

  const syncSidebarPreview = useCallback(
    (conversationId: number, preview: string, lastMessageAt?: string | null) => {
      dispatch(
        touchConversation({
          conversationId,
          lastMessagePreview: preview,
          lastMessageAt,
        }),
      );

      const { chat } = store.getState();
      const exists = [...chat.queue, ...chat.mySupportThreads].some(
        conversation => conversation.id === conversationId,
      );
      if (!exists) {
        void dispatch(fetchSupportQueueThunk());
      }
    },
    [dispatch, store],
  );

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchSupportQueueThunk()).unwrap(),
        dispatch(fetchMyConversationsThunk()).unwrap(),
      ]);
    } catch {
      /* toast via slice error or ignore */
    }
  }, [dispatch]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!error) {
      return;
    }
    toast.error(error);
    dispatch(clearChatError());
  }, [error, dispatch]);

  const selectThread = useCallback(
    (conversationId: number) => {
      dispatch(selectConversationAction(conversationId));
      const { chat } = store.getState();
      const conv = [...chat.queue, ...chat.mySupportThreads].find(c => c.id === conversationId);
      if (conv?.claimed) {
        void dispatch(
          fetchConversationMessagesThunk({
            conversationId,
            params: MESSAGE_LIST_PARAMS,
          }),
        ).unwrap();
      }
    },
    [dispatch, store],
  );

  useEffect(() => {
    if (!selectedConversationId || !selectedConversation?.claimed) {
      lastJoinedId.current = null;
      return;
    }
    if (lastJoinedId.current === selectedConversationId) {
      return;
    }
    const run = async () => {
      try {
        await emitJoinConversation(selectedConversationId);
        lastJoinedId.current = selectedConversationId;
      } catch {
        lastJoinedId.current = null;
      }
    };
    void run();
  }, [selectedConversationId, selectedConversation?.claimed]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return undefined;
    }

    const onMessageRealtime = (payload: MessageRealtimePayload) => {
      if (payload.conversationId == null) {
        return;
      }

      if (
        payload.conversationId === selectedConversationId &&
        payload.senderId !== currentUserId
      ) {
        const message = messageFromRealtimePayload(payload, payload.conversationId);
        if (message) {
          dispatch(appendMessage(message));
        }
      }

      if (payload.content) {
        syncSidebarPreview(
          payload.conversationId,
          payload.content,
          payload.createdAt ?? null,
        );
      }
    };

    socket.on('message:new', onMessageRealtime);
    socket.on('message:created', onMessageRealtime);
    return () => {
      socket.off('message:new', onMessageRealtime);
      socket.off('message:created', onMessageRealtime);
    };
  }, [dispatch, selectedConversationId, currentUserId, syncSidebarPreview]);

  const claimSelected = useCallback(async () => {
    if (selectedConversationId == null) {
      return;
    }
    const result = await dispatch(claimConversationThunk(selectedConversationId));
    if (claimConversationThunk.fulfilled.match(result)) {
      toast.success('Conversation claimed');
      await dispatch(
        fetchConversationMessagesThunk({
          conversationId: selectedConversationId,
          params: MESSAGE_LIST_PARAMS,
        }),
      ).unwrap();
      await refreshAll();
      return;
    }
    toast.error(result.payload ?? 'Claim failed');
  }, [dispatch, selectedConversationId, refreshAll]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !selectedConversation?.claimed) {
        return;
      }
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }
      if (!currentUserId) {
        toast.error('Missing user identity');
        return;
      }
      if (socketStatus !== 'connected') {
        toast.error('Socket is not connected');
        return;
      }
      try {
        const saved = await emitSendMessage(
          {
            conversationId: selectedConversationId,
            content: trimmed,
          },
          currentUserId,
        );
        dispatch(appendMessage(saved));
        syncSidebarPreview(saved.conversationId, saved.content, saved.createdAt);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to send message');
      }
    },
    [dispatch, selectedConversationId, selectedConversation?.claimed, currentUserId, socketStatus, syncSidebarPreview],
  );

  return {
    queue,
    mySupportThreads,
    selectedConversationId,
    selectedConversation,
    messages,
    isQueueLoading,
    isMyThreadsLoading,
    isMessagesLoading,
    isClaiming,
    currentUserId,
    refreshAll,
    selectThread,
    claimSelected,
    sendMessage,
    clearSelection: () => {
      dispatch(selectConversationAction(null));
    },
  };
}
