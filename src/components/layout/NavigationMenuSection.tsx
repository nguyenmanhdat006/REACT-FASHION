import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Divider } from '@/components/Divider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LAST_ORDERS,
  SIDEBAR_LOGOUT_ICON,
} from '@/pages/productV2/HomeV2/homeDemoData';
import { PRIMARY_NAV_ITEMS } from './navigationMenuData';

import { LastOrderButton } from './components/LastOrderButton';
import { NavButton } from './components/NavButton';

export function NavigationMenuSection(): JSX.Element {
  const LogOutIcon = SIDEBAR_LOGOUT_ICON;
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveItem = (to: string): boolean => {
    const [pathname, hashPart] = to.split('#');
    if (location.pathname !== pathname) return false;

    const hash = location.hash ?? '';

    if (pathname === '/v2/products') {
      if (!hashPart) {
        return hash === '' || hash === '#explore';
      }
      return hash === `#${hashPart}`;
    }

    if (!hashPart) {
      return hash === '';
    }
    return hash === `#${hashPart}`;
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="relative flex h-screen w-[300px] flex-col items-center justify-between border-r border-solid border-gray-100 bg-white px-8 py-12"
    >
      <div className="relative flex flex-col items-start gap-8 self-stretch">
        <div className="self-stretch text-h4-semi leading-tight text-gray-black">
          Cartify
        </div>
        <div className="relative flex w-full flex-col items-center justify-center gap-5 self-stretch">
          <nav
            aria-label="Primary"
            className="relative flex flex-col items-start gap-2 self-stretch"
          >
            {PRIMARY_NAV_ITEMS.map((item) => (
              <NavButton
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={isActiveItem(item.to)}
                onClick={() => navigate(item.to)}
              />
            ))}
          </nav>

          <Divider orientation="horizontal" />

          <section
            aria-labelledby="last-orders-heading"
            className="relative flex flex-col items-center self-stretch"
          >
            <div className="relative flex items-center gap-1 self-stretch">
              <h2
                id="last-orders-heading"
                className="relative w-fit whitespace-nowrap text-caption-lg-regular text-gray-500"
              >
                Last Orders
              </h2>
              <div className="relative w-fit whitespace-nowrap text-body-regular">
                37
              </div>
            </div>
            <div className="relative flex flex-col items-start self-stretch">
              {LAST_ORDERS.map((order) => (
                <LastOrderButton
                  key={order.label}
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
