import { Headphones, Loader2, MessageCircle, Send, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function formatChatTime(input?: string | null): string {
  if (!input) {
    return '';
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatAvatar({
  label,
  className,
}: {
  label: string;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
        'bg-primary-100 text-caption-lg-semi text-primary-700 ring-2 ring-white',
        className,
      )}
      aria-hidden
    >
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function ChatMessageBubble({
  content,
  createdAt,
  isOwn,
  otherLabel = 'Support',
}: {
  content: string;
  createdAt?: string | null;
  isOwn: boolean;
  otherLabel?: string;
}): React.ReactElement {
  return (
    <div className={cn('flex w-full', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'flex max-w-[88%] flex-col gap-1',
          isOwn ? 'items-end' : 'items-start',
        )}
      >
        {!isOwn ? (
          <span className="px-1 text-caption-xs-medium text-gray-500">{otherLabel}</span>
        ) : null}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2.5 shadow-sm',
            isOwn
              ? 'rounded-br-md bg-primary text-primary-foreground'
              : 'rounded-bl-md border border-gray-100 bg-white text-gray-black',
          )}
        >
          <p className="text-body-regular whitespace-pre-wrap break-words">{content}</p>
          <p
            className={cn(
              'mt-1 text-right text-caption-xs-regular',
              isOwn ? 'text-primary-100' : 'text-gray-400',
            )}
          >
            {formatChatTime(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  sending,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  placeholder: string;
  disabled?: boolean;
  sending?: boolean;
  error?: string | null;
}): React.ReactElement {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-gray-100 bg-white/95 p-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white p-1 pl-4 shadow-sm focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-primary/20">
        <Input
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled || sending}
          className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          aria-label="Message"
        />
        <Button
          type="submit"
          size="icon-sm"
          className="h-9 w-9 shrink-0 rounded-full"
          disabled={disabled || sending || !value.trim()}
          aria-label="Send message"
        >
          {sending ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {error ? <p className="mt-2 px-1 text-caption-sm-regular text-destructive">{error}</p> : null}
    </form>
  );
}

export function ChatEmptyState({
  title,
  description,
  icon = 'messages',
}: {
  title: string;
  description?: string;
  icon?: 'messages' | 'support';
}): React.ReactElement {
  const Icon = icon === 'support' ? Headphones : MessageCircle;
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-8 ring-primary-50/60">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="text-body-semi text-gray-black">{title}</p>
        {description ? (
          <p className="mt-1 text-caption-lg-regular text-gray-500">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ChatLoadingState(): React.ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}

export function ChatPanelHeader({
  title,
  subtitle,
  onClose,
  action,
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  action?: ReactNode;
}): React.ReactElement {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-primary-100/80 bg-gradient-to-r from-primary-50 via-white to-secondary-50 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Headphones className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-semi text-gray-black">{title}</p>
          {subtitle ? (
            <p className="truncate text-caption-sm-regular text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {action}
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-gray-500 hover:bg-gray-100 hover:text-gray-black"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
