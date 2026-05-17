import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useMemo, type JSX } from 'react';

import { LabelButton } from '@/components/buttons/LabelButton';
import { useAdminUsers } from '@/hooks/user/useAdminUsers';
import AdminUserList from '@/pages/userv2/AdminUserList/sections/AdminUserList';
import { userToAdminUserRow } from '@/pages/userv2/AdminUserList/userDisplayMappers';
import { useAppSelector } from '@/store/hooks';

import type { AdminUserRow } from './sections/AdminUserList';

const LIST_PAGE_SIZE = 10;

export default function AdminUserListPage(): JSX.Element {
  const { fetchUsersPage, updateUserRoles } = useAdminUsers();
  const {
    listItems,
    listPage,
    listSize,
    listTotalPages,
    isListLoading,
    listError,
  } = useAppSelector((s) => s.user);

  useEffect(() => {
    void fetchUsersPage({ page: 0, size: LIST_PAGE_SIZE });
  }, [fetchUsersPage]);

  const listParams = useMemo(
    () => ({
      page: listPage,
      size: listSize || LIST_PAGE_SIZE,
    }),
    [listPage, listSize],
  );

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
        currentPage={currentPage}
        totalPages={safeTotalPages}
        onPageChange={onPageChange}
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
