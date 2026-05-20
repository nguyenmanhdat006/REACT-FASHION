import { MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react';

import {
  ChatComposer,
  ChatEmptyState,
  ChatLoadingState,
  ChatMessageBubble,
  ChatPanelHeader,
} from '@/components/chat/chatPrimitives';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatUserId } from '@/hooks/chat/useChatUserId';
import { useSupportChatWidget } from '@/hooks/chat/useSupportChatWidget';

export function SupportChatWidget(): JSX.Element | null {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useChatUserId();
  const {
    hidden,
    open,
    loading,
    sendState,
    messages,
    unreadCount,
    error,
    toggleOpen,
    close,
    sendMessage,
  } = useSupportChatWidget();

  useEffect(() => {
    if (!open) {
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [open, messages.length]);

  if (hidden) {
    return null;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await sendMessage(draft);
    if (ok) {
      setDraft('');
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50">
      {open ? (
        <section
          className={cn(
            'pointer-events-auto flex h-[min(520px,78dvh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden',
            'rounded-2xl border border-primary-100/80 bg-white shadow-2xl shadow-primary-900/10',
          )}
        >
          <ChatPanelHeader
            title="Customer support"
            subtitle="We typically reply within a few minutes"
            onClose={close}
          />

          <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-primary-50/40 via-white to-gray-50/80">
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-hide">
              {loading ? (
                <ChatLoadingState />
              ) : messages.length === 0 ? (
                <ChatEmptyState
                  icon="support"
                  title="How can we help?"
                  description="Send a message to start chatting with our support team."
                />
              ) : (
                messages.map(message => (
                  <ChatMessageBubble
                    key={message.id}
                    content={message.content}
                    createdAt={message.createdAt}
                    isOwn={message.senderId === currentUserId}
                    otherLabel="Support"
                  />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <ChatComposer
              value={draft}
              onChange={setDraft}
              onSubmit={onSubmit}
              placeholder="Write your message…"
              sending={sendState === 'sending'}
              error={error}
            />
          </div>
        </section>
      ) : (
        <Button
          type="button"
          onClick={toggleOpen}
          size="icon-lg"
          className={cn(
            'pointer-events-auto relative h-14 w-14 rounded-full shadow-lg shadow-primary/30',
            'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-caption-xs-semi text-white ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Button>
      )}
    </div>
  );
}
