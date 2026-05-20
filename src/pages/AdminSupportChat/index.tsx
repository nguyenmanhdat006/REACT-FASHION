import { Helmet } from 'react-helmet-async';
import { BadgeCheck, Clock, Loader2, MessageCircle, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type JSX, type ReactNode } from 'react';

import {
  ChatAvatar,
  ChatComposer,
  ChatEmptyState,
  ChatLoadingState,
  ChatMessageBubble,
  formatChatTime,
} from '@/components/chat/chatPrimitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAdminSupportChat } from '@/hooks/chat/useAdminSupportChat';
import type { ConversationInbound } from '@/types/chat/chat';

function ConversationRow({
  conv,
  active,
  onSelect,
}: {
  conv: ConversationInbound;
  active: boolean;
  onSelect: () => void;
}): JSX.Element {
  const label = conv.supportCustomerUserId ?? `Conversation ${conv.id}`;
  const isUnclaimed = !conv.claimed;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all',
        active
          ? 'bg-primary-50 shadow-sm ring-1 ring-primary-200'
          : 'hover:bg-gray-50',
      )}
    >
      <ChatAvatar label={label} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block truncate text-body-semi text-gray-black">{label}</span>
          {isUnclaimed ? (
            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-caption-xs-semi text-accent-700">
              New
            </span>
          ) : (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          )}
        </span>
        <span className="block truncate text-caption-lg-regular text-gray-500">
          {isUnclaimed ? 'Waiting in queue' : 'Assigned to you'}
        </span>
        {conv.lastMessagePreview ? (
          <span className="mt-0.5 block truncate text-caption-sm-regular text-gray-400">
            {conv.lastMessagePreview}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 text-caption-xs-regular text-gray-400">
        <Clock className="h-3 w-3" aria-hidden />
        {formatChatTime(conv.lastMessageAt ?? conv.updatedAt)}
      </span>
    </button>
  );
}

function ConversationSection({
  title,
  count,
  loading,
  emptyText,
  children,
}: {
  title: string;
  count: number;
  loading: boolean;
  emptyText: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-caption-lg-semi text-gray-600">{title}</p>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-caption-xs-semi text-gray-500">
          {count}
        </span>
      </div>
      {loading && count === 0 ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
        </div>
      ) : (
        children
      )}
      {!loading && count === 0 ? (
        <p className="px-2 py-2 text-caption-lg-regular text-gray-400">{emptyText}</p>
      ) : null}
    </section>
  );
}

export default function AdminSupportChatPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const {
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
    selectThread,
    claimSelected,
    sendMessage,
  } = useAdminSupportChat();

  const filteredQueue = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return queue;
    }
    return queue.filter(c => (c.supportCustomerUserId ?? '').toLowerCase().includes(q));
  }, [queue, search]);

  const filteredMine = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return mySupportThreads;
    }
    return mySupportThreads.filter(c => (c.supportCustomerUserId ?? '').toLowerCase().includes(q));
  }, [mySupportThreads, search]);

  const orderedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [orderedMessages.length, selectedConversationId]);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(draft);
    setDraft('');
  };

  const canReply = Boolean(selectedConversation?.claimed);

  return (
    <>
      <Helmet>
        <title>Messages — Admin</title>
      </Helmet>
      <div
        className={cn(
          'relative -mx-8 flex min-h-0 w-[calc(100%+4rem)] max-w-none flex-1 flex-col overflow-hidden',
          'rounded-2xl border border-gray-100 bg-white shadow-sm shadow-primary-900/5',
          'h-[calc(100dvh-10rem)] min-h-[420px]',
        )}
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-gray-100 lg:grid-cols-[minmax(260px,300px)_1fr] lg:divide-x lg:divide-y-0">
          <aside className="flex min-h-0 flex-col bg-white lg:max-w-none">
            <div className="border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h1 className="text-h5-semi text-gray-black">Inbox</h1>
                  <p className="text-caption-lg-regular text-gray-500">Support conversations</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search customers…"
                  className="rounded-full border-gray-100 bg-white pl-9 shadow-sm"
                  aria-label="Search conversations"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
              <ConversationSection
                title="Queue"
                count={filteredQueue.length}
                loading={isQueueLoading}
                emptyText="No unclaimed chats"
              >
                {filteredQueue.length > 0 ? (
                  <ul className="space-y-1">
                    {filteredQueue.map(conv => (
                      <li key={conv.id}>
                        <ConversationRow
                          conv={conv}
                          active={conv.id === selectedConversationId}
                          onSelect={() => void selectThread(conv.id)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ConversationSection>

              <ConversationSection
                title="My threads"
                count={filteredMine.length}
                loading={isMyThreadsLoading}
                emptyText="No assigned threads"
              >
                {filteredMine.length > 0 ? (
                  <ul className="space-y-1">
                    {filteredMine.map(conv => (
                      <li key={conv.id}>
                        <ConversationRow
                          conv={conv}
                          active={conv.id === selectedConversationId}
                          onSelect={() => void selectThread(conv.id)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </ConversationSection>
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col bg-white">
            {selectedConversation ? (
              <>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <ChatAvatar
                      label={selectedConversation.supportCustomerUserId ?? 'CU'}
                      className="h-11 w-11"
                    />
                    <div className="min-w-0">
                      <h2 className="truncate text-h6-semi text-gray-black">
                        {selectedConversation.supportCustomerUserId ?? `Chat #${selectedConversation.id}`}
                      </h2>
                      <p className="text-caption-lg-regular text-gray-500">
                        {selectedConversation.claimed ? (
                          <span className="inline-flex items-center gap-1 text-primary-700">
                            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                            Active conversation
                          </span>
                        ) : (
                          'Claim to start replying'
                        )}
                      </p>
                    </div>
                  </div>
                  {!selectedConversation.claimed ? (
                    <Button
                      type="button"
                      onClick={() => void claimSelected()}
                      disabled={isClaiming}
                      className="rounded-full px-5"
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                          Claiming…
                        </>
                      ) : (
                        'Claim chat'
                      )}
                    </Button>
                  ) : null}
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-white px-5 py-4 scrollbar-hide">
                  {isMessagesLoading ? (
                    <ChatLoadingState />
                  ) : orderedMessages.length === 0 ? (
                    <ChatEmptyState
                      title={
                        selectedConversation.claimed ? 'No messages yet' : 'Claim this conversation'
                      }
                      description={
                        selectedConversation.claimed
                          ? 'Send the first message to the customer.'
                          : 'Claim the chat to view and reply to messages.'
                      }
                    />
                  ) : (
                    orderedMessages.map(m => (
                      <ChatMessageBubble
                        key={m.id}
                        content={m.content}
                        createdAt={m.createdAt}
                        isOwn={m.senderId === currentUserId}
                        otherLabel="Customer"
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <ChatComposer
                  value={draft}
                  onChange={setDraft}
                  onSubmit={onSend}
                  placeholder={canReply ? 'Type your reply…' : 'Claim the chat to reply'}
                  disabled={!canReply || isMessagesLoading}
                  error={null}
                />
              </>
            ) : (
              <ChatEmptyState
                title="Select a conversation"
                description="Pick a thread from the inbox to view messages and reply."
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
