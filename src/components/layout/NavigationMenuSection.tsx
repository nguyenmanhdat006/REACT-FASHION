import type { JSX } from 'react';
import { MessageCirclePlus, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Divider } from '@/components/Divider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RECENTS_CHAT, SIDEBAR_LOGOUT_ICON } from '@/pages/UserHomeV2/homeDemoData';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRecentOrders } from '@/hooks/order/useRecentOrders';
import { getSidebarNavItems } from '@/routes/appShellRoutes';

import { NavButton } from './components/NavButton';

export function NavigationMenuSection(): JSX.Element {
  const LogOutIcon = SIDEBAR_LOGOUT_ICON;
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdminShell = location.pathname.includes('/admin');
  const sidebarNavItems = getSidebarNavItems(location.pathname);
  const {
    items: recentOrders,
    totalCount: recentOrdersTotal,
    isLoading: isRecentOrdersLoading,
  } = useRecentOrders(isAuthenticated && !isAdminShell);

  return (
    <aside
      aria-label="Sidebar navigation"
      className="relative flex h-screen w-[300px] flex-col items-center justify-between border-r border-solid border-gray-100 bg-white px-8 py-12"
    >
      <div className="relative flex flex-col items-start gap-8 self-stretch">
        <div className="flex items-start justify-center gap-2">
          <img src="/logo.svg" alt="Cartify" className="w-10 h-10" />
          <div className="self-stretch text-h4-semi leading-tight text-gray-black">
            {isAdminShell ? 'Cartify Admin' : 'Cartify'}
          </div>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center gap-5 self-stretch">
          <nav
            aria-label="Primary"
            className="relative flex flex-col items-start gap-1 self-stretch"
          >
            {sidebarNavItems.map((item) => (
              <NavButton
                key={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
                onClick={() => {
                  if (item.to === ROUTES.ORDERS && !isAuthenticated) {
                    navigate(ROUTES.LOGIN);
                    return;
                  }
                  navigate(item.to);
                }}
              />
            ))}
          </nav>

          {isAdminShell ? (
            <>
              <Divider orientation="horizontal" />

              <section
                aria-labelledby="quick-actions-heading"
                className="relative flex flex-col items-start self-stretch"
              >
                <h2
                  id="quick-actions-heading"
                  className="relative w-fit whitespace-nowrap text-caption-lg-regular text-gray-500"
                >
                  Quick Actions
                </h2>
                <NavButton
                  variant="compact"
                  icon={Plus}
                  label="Add Products"
                  onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
                />
                <NavButton
                  variant="compact"
                  icon={MessageCirclePlus}
                  label="Chat"
                  onClick={() => navigate(ROUTES.ADMIN_MESSAGES)}
                />
              </section>
            </>
          ) : null}

          <Divider orientation="horizontal" />

          <section
            aria-labelledby={isAdminShell ? 'recents-chat-heading' : 'last-orders-heading'}
            className="relative flex flex-col items-center self-stretch"
          >
            <div className="relative flex items-center gap-1 self-stretch">
              <h2
                id={isAdminShell ? 'recents-chat-heading' : 'last-orders-heading'}
                className="relative w-fit whitespace-nowrap text-caption-lg-regular text-gray-500"
              >
                {isAdminShell ? 'Recents Chat 2' : 'Last Orders'}
              </h2>
              {!isAdminShell && isAuthenticated ? (
                <div className="relative w-fit whitespace-nowrap text-body-regular">
                  {isRecentOrdersLoading ? '…' : recentOrdersTotal}
                </div>
              ) : null}
            </div>
            <div className="relative flex flex-col items-start self-stretch">
              {isAdminShell
                ? RECENTS_CHAT.map((chat) => (
                    <NavButton
                      key={chat.label}
                      variant="compact"
                      label={chat.label}
                      imageUrl={chat.imageUrl}
                    />
                  ))
                : null}
              {!isAdminShell && isAuthenticated && isRecentOrdersLoading ? (
                <p className="px-4 py-2 text-caption-lg-regular text-gray-500">
                  Loading orders…
                </p>
              ) : null}
              {!isAdminShell &&
              isAuthenticated &&
              !isRecentOrdersLoading &&
              recentOrders.length === 0 ? (
                <p className="px-4 py-2 text-caption-lg-regular text-gray-500">
                  No orders yet
                </p>
              ) : null}
              {!isAdminShell
                ? recentOrders.map((order) => (
                    <NavButton
                      key={order.id}
                      variant="compact"
                      label={order.label}
                      imageUrl={order.imageUrl}
                      onClick={() => navigate(ROUTES.ORDERS)}
                    />
                  ))
                : null}
            </div>
          </section>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        disabled={isAuthLoading}
        aria-label={isAuthenticated ? 'Log out of your account' : 'Sign in to your account'}
        className={cn(
          'relative flex self-stretch items-center gap-2 overflow-hidden rounded-2xl bg-white p-4 text-left',
          'h-auto justify-start shadow-none hover:bg-gray-50 focus-visible:ring-offset-0',
          isAuthenticated && 'hover:text-red-500',
        )}
        onClick={() => {
          if (isAuthenticated) {
            void logout();
            return;
          }
          navigate(ROUTES.LOGIN);
        }}
      >
        <span className="relative flex shrink-0 items-center justify-center p-0.5">
          <LogOutIcon className="h-6 w-6" aria-hidden />
        </span>
        <span className="relative w-fit whitespace-nowrap text-body-regular">
          {isAuthenticated ? 'Logout' : 'Sign in'}
        </span>
      </Button>
    </aside>
  );
}
