import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';
import { useAdminUsers } from '@/hooks/user/useAdminUsers';
import AdminUserList from '@/pages/userv2/AdminUserList/sections/AdminUserList';
import { userToAdminUserRow } from '@/pages/userv2/AdminUserList/userDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminUserRow } from './sections/AdminUserList';

const PAGE_SIZE = 10;

export default function AdminUserListPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const { fetchUsersPage, updateUserRoles } = useAdminUsers();
  const { listItems, listTotalPages, isListLoading, listError } = useAppSelector(
    (s) => s.user,
  );

  const listParams = useMemo(
    () => ({
      page: page - 1,
      size: PAGE_SIZE,
    }),
    [page],
  );

  useEffect(() => {
    void fetchUsersPage(listParams);
  }, [fetchUsersPage, listParams]);

  const rows: AdminUserRow[] = useMemo(
    () => listItems.map(userToAdminUserRow),
    [listItems],
  );

  const safeTotalPages = useMemo(
    () => Math.max(1, listTotalPages || 1),
    [listTotalPages],
  );

  const onEditRoles = useCallback(
    async (row: AdminUserRow) => {
      const next = window.prompt(
        `Roles for “${row.fullName}” (comma-separated):`,
        row.roles.join(', '),
      );
      if (next === null) return;
      const roles = next
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean);
      if (roles.length === 0) return;
      await updateUserRoles(row.id, roles, listParams);
    },
    [listParams, updateUserRoles],
  );

  return (
    <>
      <Helmet>
        <title>Users — Admin</title>
      </Helmet>
      <div className="mb-4 flex justify-start gap-3">
        <LabelButton
          label="Filters"
          type="button"
          className="bg-gray-white hover:bg-gray-100"
          ariaLabel="Open user filters"
        />
      </div>
      <AdminUserList
        users={rows}
        page={page}
        totalPages={safeTotalPages}
        onPageChange={setPage}
        onEditRoles={(row) => void onEditRoles(row)}
      />
      {isListLoading && rows.length === 0 ? (
        <p className="mt-4 text-center text-caption-lg-regular text-muted-foreground">
          Loading…
        </p>
      ) : null}
      {listError && !isListLoading ? (
        <p className="mt-4 text-center text-caption-sm-regular text-destructive">
          {listError}
        </p>
      ) : null}
    </>
  );
}
