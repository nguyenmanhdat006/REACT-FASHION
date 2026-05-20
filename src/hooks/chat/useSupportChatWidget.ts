import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { chatService } from '@/services/chat/chatService';
import { emitJoinConversation, emitSendMessage } from '@/services/chat/chatSocketService';
import { getSocket } from '@/socket';
import type { MessageRealtimePayload } from '@/socket/modules/chatModule';
import { useSocketConnection } from '@/hooks/socket/useSocketConnection';
import { useAppSelector } from '@/store/hooks';
import type { ConversationInbound, MessageInbound } from '@/types/chat/chat';

type SendState = 'idle' | 'sending';

const MESSAGE_QUERY = {
  page: 0,
  size: 100,
  sortBy: 'createdAt',
  sortDirection: 'desc' as const,
};

export function useSupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [conversation, setConversation] = useState<ConversationInbound | null>(null);
  const [messages, setMessages] = useState<MessageInbound[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const joinedConversationIdRef = useRef<number | null>(null);

  const { status } = useSocketConnection();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const currentUserId = useAppSelector(state => state.auth.user?.id ?? null);
  const roles = useAppSelector(state => state.auth.user?.roles ?? []);

  const isAdmin = useMemo(
    () => roles.some(role => role === 'ADMIN' || role === 'ROLE_ADMIN'),
    [roles],
  );
  const hidden = !isAuthenticated || isAdmin;
  const conversationId = conversation?.id ?? null;

  const loadMessages = useCallback(async (targetConversationId: number) => {
    const res = await chatService.listMessages(targetConversationId, MESSAGE_QUERY);
    if (!res.success || !res.data) {
      throw new Error(res.error ?? 'Failed to load messages');
    }
    setMessages([...(res.data.content ?? [])].reverse());
  }, []);

  const ensureConversation = useCallback(async () => {
    const res = await chatService.ensureSupportConversation();
    if (!res.success || !res.data) {
      throw new Error(res.error ?? 'Failed to start support chat');
    }
    setConversation(res.data);
    return res.data;
  }, []);

  const joinConversationRoom = useCallback((targetConversationId: number) => {
    if (joinedConversationIdRef.current === targetConversationId) {
      return;
    }
    void emitJoinConversation(targetConversationId)
      .then(() => {
        joinedConversationIdRef.current = targetConversationId;
      })
      .catch(() => {
        joinedConversationIdRef.current = null;
      });
  }, []);

  const refresh = useCallback(async () => {
    if (hidden) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const conv = conversation ?? (await ensureConversation());
      await loadMessages(conv.id);
      if (status === 'connected') {
        joinConversationRoom(conv.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load support chat');
    } finally {
      setLoading(false);
    }
  }, [
    hidden,
    conversation,
    ensureConversation,
    loadMessages,
    status,
    joinConversationRoom,
  ]);

  useEffect(() => {
    if (hidden || !open) {
      return;
    }
    void refresh();
  }, [hidden, open, refresh]);

  useEffect(() => {
    if (!conversationId || status !== 'connected') {
      return;
    }
    joinConversationRoom(conversationId);
  }, [conversationId, status, joinConversationRoom]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) {
      return undefined;
    }

    const onRealtime = (payload: MessageRealtimePayload) => {
      if (payload.conversationId !== conversationId) {
        return;
      }
      if (payload.senderId === currentUserId) {
        return;
      }
      if (!open && payload.senderId && payload.senderId !== currentUserId) {
        setUnreadCount(prev => prev + 1);
      }
      void loadMessages(conversationId);
    };

    socket.on('message:new', onRealtime);
    socket.on('message:created', onRealtime);
    return () => {
      socket.off('message:new', onRealtime);
      socket.off('message:created', onRealtime);
    };
  }, [conversationId, open, currentUserId, loadMessages]);

  const toggleOpen = useCallback(() => {
    setOpen(prev => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
      }
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return false;
      }
      if (!currentUserId) {
        setError('Missing user identity');
        return false;
      }
      if (status !== 'connected') {
        setError('Socket is not connected');
        return false;
      }
      try {
        setSendState('sending');
        setError(null);
        const conv = conversation ?? (await ensureConversation());
        joinConversationRoom(conv.id);
        const saved = await emitSendMessage(
          {
            conversationId: conv.id,
            content: trimmed,
          },
          currentUserId,
        );
        setConversation(prev => prev ?? conv);
        setMessages(prev => [...prev, saved]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        return false;
      } finally {
        setSendState('idle');
      }
    },
    [conversation, currentUserId, ensureConversation, joinConversationRoom, status],
  );

  return {
    hidden,
    open,
    loading,
    sendState,
    messages,
    unreadCount,
    error,
    conversation,
    toggleOpen,
    close: () => setOpen(false),
    refresh,
    sendMessage,
  };
}
