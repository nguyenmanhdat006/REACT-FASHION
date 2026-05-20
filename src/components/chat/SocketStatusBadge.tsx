import type { JSX } from 'react';

import { cn } from '@/lib/utils';
import type { SocketConnectionStatus } from '@/lib/socket/chatSocket';

const STATUS_LABEL: Record<SocketConnectionStatus, string> = {
  idle: 'Socket idle',
  connecting: 'Socket connecting…',
  connected: 'Socket connected',
  disconnected: 'Socket disconnected',
  error: 'Socket error',
};

const STATUS_CLASS: Record<SocketConnectionStatus, string> = {
  idle: 'bg-gray-600',
  connecting: 'bg-amber-600',
  connected: 'bg-emerald-600',
  disconnected: 'bg-gray-500',
  error: 'bg-red-600',
};

export type SocketStatusBadgeProps = {
  status: SocketConnectionStatus;
};

export function SocketStatusBadge({ status }: SocketStatusBadgeProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed bottom-4 right-4 z-[100] rounded-full px-3 py-1 text-xs font-medium text-white shadow-md',
        STATUS_CLASS[status],
      )}
    >
      {STATUS_LABEL[status]}
    </div>
  );
}
