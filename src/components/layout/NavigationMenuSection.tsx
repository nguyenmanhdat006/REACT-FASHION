import type { JSX } from 'react';
import { MessageCirclePlus, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Divider } from '@/components/Divider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LAST_ORDERS,
  RECENTS_CHAT,
  SIDEBAR_LOGOUT_ICON,
} from '@/pages/productV2/homeDemoData';
import { getSidebarNavItems } from '@/routes/v2/appShellRoutes';

import { NavButton } from './components/NavButton';

export function NavigationMenuSection(): JSX.Element {
  const LogOutIcon = SIDEBAR_LOGOUT_ICON;
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminShell = location.pathname.includes('/admin');
  const sidebarNavItems = getSidebarNavItems(location.pathname);

  return (
    <aside
      aria-label="Sidebar navigation"
      className="relative flex h-screen w-[300px] flex-col items-center justify-between border-r border-solid border-gray-100 bg-white px-8 py-12"
    >
      <div className="relative flex flex-col items-start gap-8 self-stretch">
        <div className="self-stretch text-h4-semi leading-tight text-gray-black">
          {isAdminShell ? 'Cartify Admin' : 'Cartify'}
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
                onClick={() => navigate(item.to)}
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
                  onClick={() => navigate('/v2/admin/products')}
                />
                <NavButton
                  variant="compact"
                  icon={MessageCirclePlus}
                  label="Chat"
                  onClick={() => navigate('/v2')}
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
              {!isAdminShell ? (
                <div className="relative w-fit whitespace-nowrap text-body-regular">
                  37
                </div>
              ) : null}
            </div>
            <div className="relative flex flex-col items-start self-stretch">
              {(isAdminShell ? RECENTS_CHAT : LAST_ORDERS).map((order) => (
                <NavButton
                  key={order.label}
                  variant="compact"
                  label={order.label}
                  imageUrl={order.imageUrl}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        className={cn(
          'relative flex self-stretch items-center gap-2 overflow-hidden rounded-2xl bg-white p-4 text-left',
          'h-auto justify-start shadow-none hover:bg-gray-50 focus-visible:ring-offset-0 hover:text-red-500',
        )}
      >
        <span className="relative flex shrink-0 items-center justify-center p-0.5">
          <LogOutIcon className="h-6 w-6" aria-hidden />
        </span>
        <span className="relative w-fit whitespace-nowrap text-body-regular">
          Logout
        </span>
      </Button>
    </aside>
  );
}
