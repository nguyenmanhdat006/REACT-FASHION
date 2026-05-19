import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import AdminListPageLayout from '@/components/admin/AdminListPageLayout';
import {
  AdminListFilterPanel,
  filterUserRows,
  paginateRows,
  totalPagesForRows,
  useAdminListFilters,
} from '@/components/admin/filters';
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
const USER_FETCH_SIZE = 500;
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
  const [clientPage, setClientPage] = useState(0);
  const listFilters = useAdminListFilters('user');
  const { fetchUsersPage, clearUserDetailState } = useAdminUsers();
  const { listItems, isListLoading, listError } = useAppSelector(s => s.user);

  useEffect(() => {
    void fetchUsersPage({ page: 0, size: USER_FETCH_SIZE });
  }, [fetchUsersPage]);

  useEffect(() => {
    if (!panel.open) {
      clearUserDetailState();
    }
  }, [panel.open, clearUserDetailState]);

  const filteredRows: AdminUserRow[] = useMemo(() => {
    const mapped = listItems.map(userToAdminUserRow);
    return filterUserRows(mapped, listFilters.applied);
  }, [listItems, listFilters.applied]);

  const rows = useMemo(
    () => paginateRows(filteredRows, clientPage, LIST_PAGE_SIZE),
    [filteredRows, clientPage],
  );

  const currentPage = clientPage + 1;
  const safeTotalPages = totalPagesForRows(filteredRows.length, LIST_PAGE_SIZE);

  const onPageChange = useCallback((nextPage: number) => {
    setClientPage(nextPage - 1);
  }, []);

  const handleApplyFilters = useCallback(() => {
    listFilters.applyDraft();
    setClientPage(0);
  }, [listFilters]);

  const openEditPanel = useCallback((row: AdminUserRow) => {
    setPanel({ open: true, mode: 'edit', entityId: row.id });
  }, []);

  const closePanel = useCallback(() => {
    setPanel({ open: false });
  }, []);

  const onFormSuccess = useCallback(() => {
    closePanel();
    void fetchUsersPage({ page: 0, size: USER_FETCH_SIZE });
  }, [closePanel, fetchUsersPage]);

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
        onFiltersClick={listFilters.openPanel}
        activeFilterCount={listFilters.activeFilterCount}
        showAddButton={false}
        loading={isListLoading && filteredRows.length === 0}
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

      <AdminListFilterPanel
        preset="user"
        open={listFilters.isOpen}
        draft={listFilters.draft}
        onClose={listFilters.closePanel}
        onDraftChange={listFilters.patchDraft}
        onApply={handleApplyFilters}
        onClearAll={() => {
          listFilters.clearAll();
          setClientPage(0);
        }}
      />
    </>
  );
}
