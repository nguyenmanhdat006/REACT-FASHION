import { Home, LayoutDashboard, User } from 'lucide-react';
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES, USER_ROLES } from '@/constants';

import { UserButton } from './UserButton';

export type UserAccountMenuProps = {
  isAuthenticated: boolean;
  userName: string;
  avatarUrl?: string | null;
  roles?: string[];
};

export function UserAccountMenu({
  isAuthenticated,
  userName,
  avatarUrl,
  roles,
}: UserAccountMenuProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnAdminRoute = location.pathname.includes('/admin');
  const isAdmin = roles?.includes(USER_ROLES.ADMIN) ?? false;

  if (!isAuthenticated) {
    return (
      <UserButton
        userName={userName}
        avatarUrl={avatarUrl}
        ariaLabel="Sign in"
        onClick={() => navigate(ROUTES.LOGIN)}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserButton
          userName={userName}
          avatarUrl={avatarUrl}
          ariaLabel={`Open account menu for ${userName}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onSelect={() => navigate(ROUTES.PROFILE)}>
          <User className="size-4" aria-hidden />
          Profile
        </DropdownMenuItem>
        {isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                navigate(isOnAdminRoute ? ROUTES.HOME : ROUTES.ADMIN_DASHBOARD)
              }
            >
              {isOnAdminRoute ? (
                <Home className="size-4" aria-hidden />
              ) : (
                <LayoutDashboard className="size-4" aria-hidden />
              )}
              {isOnAdminRoute ? 'Home Page' : 'Admin Page'}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
