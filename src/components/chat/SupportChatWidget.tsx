import { MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSupportChatWidget } from '@/hooks/chat/useSupportChatWidget';

function formatTime(input?: string | null): string {
  if (!input) {
    return '';
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function SupportChatWidget(): JSX.Element | null {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
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
        <section className="pointer-events-auto flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <header className="flex items-center justify-between border-b border-gray-100 bg-primary-900 px-4 py-3 text-gray-white">
            <div>
              <p className="text-body-semi">Support</p>
              <p className="text-caption-sm-regular text-primary-100">Chat with admin</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-gray-white hover:bg-primary-800 hover:text-gray-white"
              onClick={close}
              aria-label="Close support chat"
            >
              <X />
            </Button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col bg-gray-50">
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {loading ? (
                <p className="py-6 text-center text-caption-lg-regular text-gray-500">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="py-6 text-center text-caption-lg-regular text-gray-500">
                  Start a conversation with support.
                </p>
              ) : (
                messages.map(message => (
                  <article
                    key={message.id}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2',
                      'border border-gray-100 bg-white',
                    )}
                  >
                    <p className="text-body-regular text-gray-black">{message.content}</p>
                    <p className="mt-1 text-right text-caption-xs-regular text-gray-400">
                      {formatTime(message.createdAt)}
                    </p>
                  </article>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={onSubmit} className="border-t border-gray-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  placeholder="Type your message..."
                  aria-label="Support chat input"
                />
                <Button
                  type="submit"
                  className="rounded-full px-4"
                  disabled={sendState === 'sending' || !draft.trim()}
                >
                  Send
                </Button>
              </div>
              {error ? <p className="mt-2 text-caption-sm-regular text-red-500">{error}</p> : null}
            </form>
          </div>
        </section>
      ) : (
        <Button
          type="button"
          onClick={toggleOpen}
          className="relative pointer-events-auto h-14 w-14 rounded-full shadow-lg"
          aria-label="Open support chat"
        >
          <MessageCircle />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-caption-xs-regular text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </Button>
      )}
    </div>
  );
}
