import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import type { AdminEntityPanelState } from '@/components/admin/types';
import TableView, { type TableColumn } from '@/components/TableView';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminUserV2Form, { ADMIN_USER_V2_FORM_ID } from '@/forms/AdminUserV2';
import { useAdminUsers } from '@/hooks/user/useAdminUsers';
import {
  userToAdminUserRow,
  type AdminUserRow,
} from '@/pages/AdminUserV2/userDisplayMappers';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

const LIST_PAGE_SIZE = 10;
const RESOURCE_LABEL = 'user';

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
      cell: user => (
        <Avatar className="size-12">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt="" loading="lazy" className="object-top" />
          ) : null}
          <AvatarFallback className="bg-gray-50 text-caption-lg-semibold uppercase text-gray-700">
            {user.avatarInitials || '—'}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      id: 'name',
      header: 'Name & Email',
      cellClassName: 'whitespace-normal py-4',
      cell: user => (
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
      cell: user => user.phone,
    },
    {
      id: 'roles',
      header: 'Roles',
      headerClassName: 'text-center text-body-medium',
      cellClassName: 'text-center',
      cell: user => (
        <div className="flex flex-wrap justify-center gap-1">
          {user.roles.map(role => (
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
      cell: user => (
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
      cell: user => (user.emailVerified ? 'Yes' : 'No'),
    },
    {
      id: 'joined',
      header: 'Joined',
      headerClassName: 'text-center text-body-medium text-foreground',
      cellClassName: 'text-center text-caption-sm-regular text-muted-foreground',
      cell: user => user.joinedAtFormatted,
    },
  ];
}

export default function AdminUserListPage(): JSX.Element {
  const [panel, setPanel] = useState<AdminEntityPanelState>({ open: false });
  const [formBusy, setFormBusy] = useState(false);
  const { fetchUsersPage, clearUserDetailState } = useAdminUsers();
  const {
    listItems,
    listPage,
    listSize,
    listTotalPages,
    isListLoading,
    listError,
  } = useAppSelector(s => s.user);

  useEffect(() => {
    void fetchUsersPage({ page: 0, size: LIST_PAGE_SIZE });
  }, [fetchUsersPage]);

  useEffect(() => {
    if (!panel.open) {
      clearUserDetailState();
    }
  }, [panel.open, clearUserDetailState]);

  const rows: AdminUserRow[] = useMemo(
    () => listItems.map(userToAdminUserRow),
    [listItems],
  );

  const currentPage = listPage + 1;
  const safeTotalPages = Math.max(1, listTotalPages || 1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      void fetchUsersPage({ page: nextPage - 1, size: listSize || LIST_PAGE_SIZE });
    },
    [fetchUsersPage, listSize],
  );

  const openEditPanel = useCallback((row: AdminUserRow) => {
    setPanel({ open: true, mode: 'edit', entityId: row.id });
  }, []);

  const closePanel = useCallback(() => {
    setPanel({ open: false });
  }, []);

  const onFormSuccess = useCallback(() => {
    closePanel();
    void fetchUsersPage({ page: listPage, size: listSize || LIST_PAGE_SIZE });
  }, [closePanel, fetchUsersPage, listPage, listSize]);

  const columns = useMemo(() => buildUserColumns(), []);

  const panelFormKey = panel.open
    ? `${panel.mode}-${panel.entityId ?? 'new'}`
    : 'closed';

  return (
    <>
      <Helmet>
        <title>Users — Admin</title>
      </Helmet>

      <AdminListPageLayout
        resourceLabel={RESOURCE_LABEL}
        panel={panel}
        onPanelChange={setPanel}
        showAddButton={false}
        loading={isListLoading && rows.length === 0}
        error={listError}
        formId={ADMIN_USER_V2_FORM_ID}
        busy={formBusy}
        panelChildren={
          panel.open && panel.mode === 'edit' && panel.entityId ? (
            <AdminUserV2Form
              key={panelFormKey}
              mode="update"
              userId={panel.entityId}
              onSuccess={onFormSuccess}
              onBusyChange={setFormBusy}
            />
          ) : null
        }
      >
        <TableView
          rows={rows}
          columns={columns}
          currentPage={currentPage}
          totalPages={safeTotalPages}
          onPageChange={onPageChange}
          onEdit={openEditPanel}
        />
      </AdminListPageLayout>
    </>
  );
}
