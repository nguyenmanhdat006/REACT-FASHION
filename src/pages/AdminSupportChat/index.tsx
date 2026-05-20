import { Helmet } from 'react-helmet-async';
import { Loader2, MessageCircle, Search } from 'lucide-react';
import { useMemo, useState, type FormEvent, type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAdminSupportChat } from '@/hooks/chat/useAdminSupportChat';
import type { ConversationInbound } from '@/types/chat/chat';
import type { MessageInbound } from '@/types/chat/chat';

function formatShortTime(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

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
  const subtitle = conv.claimed ? 'Assigned' : 'Unclaimed';
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        active ? 'bg-primary-50' : 'hover:bg-gray-50',
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-caption-lg-semi text-gray-600">
        {label.slice(0, 2).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-semi text-gray-black">{label}</span>
        <span className="block truncate text-caption-lg-regular text-gray-500">{subtitle}</span>
        {conv.lastMessagePreview ? (
          <span className="mt-0.5 block truncate text-caption-sm-regular text-gray-400">
            {conv.lastMessagePreview}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-caption-xs-regular text-gray-400">
        {formatShortTime(conv.lastMessageAt ?? conv.updatedAt)}
      </span>
    </button>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: MessageInbound;
  isOwn: boolean;
}): JSX.Element {
  return (
    <div className={cn('flex w-full', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[min(520px,85%)] rounded-2xl px-4 py-2',
          isOwn ? 'bg-primary-900 text-gray-white' : 'border border-gray-100 bg-white text-gray-black',
        )}
      >
        <p className="text-body-regular whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            'mt-1 text-caption-xs-regular',
            isOwn ? 'text-primary-100' : 'text-gray-400',
          )}
        >
          {formatShortTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function AdminSupportChatPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
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

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(draft);
    setDraft('');
  };

  return (
    <>
      <Helmet>
        <title>Messages — Admin</title>
      </Helmet>
      <div
        className={cn(
          'relative -mx-8 flex min-h-0 w-[calc(100%+4rem)] max-w-none flex-1 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white',
          'h-[calc(100dvh-10rem)] min-h-[420px]',
        )}
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-gray-100 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(200px,260px)] lg:divide-x lg:divide-y-0">
          <aside className="flex min-h-0 flex-col bg-gray-50 lg:max-w-none">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h1 className="text-h5-semi text-gray-black">Messages</h1>
              <MessageCircle className="h-5 w-5 text-gray-400" aria-hidden />
            </div>
            <div className="relative px-3 py-2">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="rounded-full border-gray-200 bg-white pl-9"
                aria-label="Search conversations"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
              <p className="px-2 py-2 text-caption-lg-semi text-gray-500">Queue</p>
              {isQueueLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-900" aria-label="Loading" />
                </div>
              ) : filteredQueue.length === 0 ? (
                <p className="px-2 py-2 text-caption-lg-regular text-gray-400">No unclaimed chats</p>
              ) : (
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
              )}

              <p className="mt-4 px-2 py-2 text-caption-lg-semi text-gray-500">My support</p>
              {isMyThreadsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-900" aria-label="Loading" />
                </div>
              ) : filteredMine.length === 0 ? (
                <p className="px-2 py-2 text-caption-lg-regular text-gray-400">No assigned threads</p>
              ) : (
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
              )}
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col bg-white">
            {selectedConversation ? (
              <>
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                  <div>
                    <h2 className="text-h5-semi text-gray-black">
                      {selectedConversation.supportCustomerUserId ?? `Chat #${selectedConversation.id}`}
                    </h2>
                    <p className="text-caption-lg-regular text-gray-500">
                      {selectedConversation.claimed ? 'Active' : 'Waiting for claim'}
                    </p>
                  </div>
                  {!selectedConversation.claimed ? (
                    <Button
                      type="button"
                      onClick={() => void claimSelected()}
                      disabled={isClaiming}
                      className="rounded-full"
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                          Claiming…
                        </>
                      ) : (
                        'Claim'
                      )}
                    </Button>
                  ) : null}
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {isMessagesLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-900" aria-label="Loading messages" />
                    </div>
                  ) : orderedMessages.length === 0 ? (
                    <p className="text-center text-caption-lg-regular text-gray-400">
                      {selectedConversation.claimed ? 'No messages yet' : 'Claim this chat to view messages'}
                    </p>
                  ) : (
                    orderedMessages.map(m => (
                      <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUserId} />
                    ))
                  )}
                </div>

                <form
                  onSubmit={onSend}
                  className="flex gap-2 border-t border-gray-100 px-4 py-3"
                >
                  <Input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder={
                      selectedConversation.claimed ? 'Type a message…' : 'Claim the chat to reply'
                    }
                    disabled={!selectedConversation.claimed || isMessagesLoading}
                    className="rounded-full border-gray-200"
                    aria-label="Message text"
                  />
                  <Button
                    type="submit"
                    className="rounded-full px-6"
                    disabled={!selectedConversation.claimed || !draft.trim()}
                  >
                    Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <MessageCircle className="h-10 w-10 text-gray-300" aria-hidden />
                <p className="text-body-regular text-gray-500">Select a conversation</p>
              </div>
            )}
          </section>

          <aside className="hidden min-h-0 flex-col bg-gray-50 lg:flex">
            <div className="border-b border-gray-100 px-4 py-3">
              <h2 className="text-h6-semi text-gray-black">User info</h2>
            </div>
            <div className="space-y-4 overflow-y-auto px-4 py-4 text-caption-lg-regular text-gray-600">
              {selectedConversation ? (
                <>
                  <div>
                    <p className="text-caption-sm-semi uppercase text-gray-400">Customer id</p>
                    <p className="mt-1 break-all text-body-regular text-gray-black">
                      {selectedConversation.supportCustomerUserId ?? '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption-sm-semi uppercase text-gray-400">Participants</p>
                    <ul className="mt-1 list-disc pl-5">
                      {selectedConversation.participantUserIds.map(id => (
                        <li key={id} className="break-all">
                          {id}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-caption-sm-semi uppercase text-gray-400">Conversation id</p>
                    <p className="mt-1 text-body-regular text-gray-black">{selectedConversation.id}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">Pick a thread to see details</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
