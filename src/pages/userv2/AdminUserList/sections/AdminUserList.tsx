import { useMemo } from 'react';

import TableView, { type TableColumn } from '@/components/TableView';
import TableRowActionsMenuTrigger from '@/components/TableRowActionsMenuTrigger';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roles: string[];
  rolesLabel: string;
  status: string;
  statusLabel: string;
  joinedAtFormatted: string;
  emailVerified: boolean;
};

export type AdminUserListProps = {
  users: AdminUserRow[];
  totalPages: number;
  onPageChange?: (page: number) => void;
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  className?: string;
  onEditRoles?: (user: AdminUserRow) => void;
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  INACTIVE: 'border-gray-200 bg-gray-100 text-gray-700',
  PENDING: 'border-amber-200 bg-amber-50 text-amber-800',
};

function buildUserColumns(): TableColumn<AdminUserRow>[] {
  return [
    {
      id: 'avatar',
      header: '',
      cellClassName: 'whitespace-normal py-4',
      cell: (user) => (
        <img
          src={user.avatarUrl}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ),
    },
    {
      id: 'name',
      header: 'Name & Email',
      cellClassName: 'whitespace-normal py-4',
      cell: (user) => (
        <div className="min-w-0 max-w-xs">
          <p className="line-clamp-1 text-body-regular text-foreground">
            {user.fullName}
          </p>
          <p className="line-clamp-1 text-caption-sm-regular text-gray-500">
            {user.email}
          </p>
        </div>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (user) => user.phone,
    },
    {
      id: 'roles',
      header: 'Roles',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (user) => (
        <div className="flex flex-wrap justify-center gap-1">
          {user.roles.map((role) => (
            <Badge
              key={`${user.id}-${role}`}
              variant="outline"
              className={cn(
                'rounded-sm text-caption-sm-regular',
                role === 'ADMIN'
                  ? 'border-primary/40 bg-primary/5 text-primary'
                  : 'border-gray-200 bg-gray-50 text-gray-800',
              )}
            >
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: (user) => (
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-caption-sm-regular',
            STATUS_BADGE[user.status] ??
              'border-primary/40 bg-primary/5 text-primary',
          )}
        >
          {user.statusLabel}
        </Badge>
      ),
    },
    {
      id: 'verified',
      header: 'Verified',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-lg-regular text-gray-900',
      cell: (user) => (user.emailVerified ? 'Yes' : 'No'),
    },
    {
      id: 'joined',
      header: 'Joined',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-sm-regular text-muted-foreground',
      cell: (user) => user.joinedAtFormatted,
    },
  ];
}

function AdminUserList({
  users,
  totalPages,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
  className,
  onEditRoles,
}: AdminUserListProps) {
  const columns = useMemo(() => buildUserColumns(), []);

  return (
    <TableView
      className={className}
      rows={users}
      columns={columns}
      totalPages={totalPages}
      onPageChange={onPageChange}
      selectedIds={selectedIds}
      onSelectedIdsChange={onSelectedIdsChange}
      renderRowActions={(user) => (
        <DropdownMenu>
          <TableRowActionsMenuTrigger label={`Actions for ${user.fullName}`} />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEditRoles?.(user)}>
              Edit roles
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}

export default AdminUserList;
