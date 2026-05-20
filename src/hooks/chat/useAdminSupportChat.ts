import { useCallback, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useStore } from 'react-redux';

import { getSocket } from '@/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import {
  claimConversationThunk,
  fetchConversationMessagesThunk,
  fetchMyConversationsThunk,
  fetchSupportQueueThunk,
} from '@/store/thunks/chatThunks';
import {
  clearChatError,
  selectConversation as selectConversationAction,
} from '@/store/slices/chatSlice';
import { chatService } from '@/services/chat/chatService';
import type { MessageRealtimePayload } from '@/socket/modules/chatModule';

const MESSAGE_LIST_PARAMS = {
  page: 0,
  size: 50,
  sortBy: 'createdAt',
  sortDirection: 'desc' as const,
};

function isAckJoined(ack: unknown): boolean {
  if (ack && typeof ack === 'object' && 'joined' in ack) {
    return Boolean((ack as { joined?: boolean }).joined);
  }
  if (ack && typeof ack === 'object' && 'ok' in ack) {
    return Boolean((ack as { ok?: boolean }).ok);
  }
  return false;
}

function emitJoinConversation(conversationId: number): Promise<void> {
  const socket = getSocket();
  if (!socket?.connected) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    socket.emit('conversation:join', conversationId, (ack: unknown) => {
      if (isAckJoined(ack)) {
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
  const currentUserId = useAppSelector(state => state.auth.user?.id ?? null);

  const selectedConversation = useMemo(() => {
    if (selectedConversationId == null) {
      return null;
    }
    const merged = [...queue, ...mySupportThreads];
    return merged.find(c => c.id === selectedConversationId) ?? null;
  }, [queue, mySupportThreads, selectedConversationId]);

  const lastJoinedId = useRef<number | null>(null);

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
      if (
        payload.conversationId != null &&
        payload.conversationId === selectedConversationId
      ) {
        void dispatch(
          fetchConversationMessagesThunk({
            conversationId: payload.conversationId,
            params: MESSAGE_LIST_PARAMS,
          }),
        );
      }
      void dispatch(fetchSupportQueueThunk());
      void dispatch(fetchMyConversationsThunk());
    };

    socket.on('message:new', onMessageRealtime);
    socket.on('message:created', onMessageRealtime);
    return () => {
      socket.off('message:new', onMessageRealtime);
      socket.off('message:created', onMessageRealtime);
    };
  }, [dispatch, selectedConversationId]);

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
      try {
        const res = await chatService.sendMessage({
          conversationId: selectedConversationId,
          content: trimmed,
        });
        if (!res.success) {
          toast.error(res.error ?? 'Failed to send');
          return;
        }
        await dispatch(
          fetchConversationMessagesThunk({
            conversationId: selectedConversationId,
            params: MESSAGE_LIST_PARAMS,
          }),
        ).unwrap();
      } catch {
        toast.error('Failed to send message');
      }
    },
    [dispatch, selectedConversationId, selectedConversation?.claimed],
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
