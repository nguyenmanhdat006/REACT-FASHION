import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  navItemClasses,
  productV2Controls,
  productV2Layout,
} from '../productV2Classes';
import {
  LAST_ORDERS,
  PRIMARY_NAV_ITEMS,
  SIDEBAR_LOGOUT_ICON,
} from './homeDemoData';

export function NavigationMenuSection(): JSX.Element {
  const LogOutIcon = SIDEBAR_LOGOUT_ICON;

  return (
    <aside
      aria-label="Sidebar navigation"
      className={productV2Layout.navAside}
    >
      <div className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-8 self-stretch">
        <div className="relative mt-[-1px] self-stretch text-h4-semi leading-tight text-gray-black">
          Cartify
        </div>
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-center justify-center gap-[22px] self-stretch">
          <nav
            aria-label="Primary"
            className="relative flex w-full flex-[0_0_auto] flex-col items-start gap-2 self-stretch"
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.active;

              return (
                <Button
                  key={item.label}
                  type="button"
                  variant="ghost"
                  size="lg"
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    navItemClasses(active),
                    'h-auto justify-start gap-2 rounded-2xl p-4 shadow-none focus-visible:ring-offset-0',
                    active
                      ? 'hover:bg-gray-900 hover:text-gray-white [&_svg]:text-gray-white'
                      : 'hover:bg-gray-50',
                  )}
                >
                  <span className="relative flex shrink-0 items-center justify-center p-0.5">
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        active ? 'text-gray-white' : 'text-gray-black',
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      'relative w-fit whitespace-nowrap text-body-regular',
                      active ? 'text-gray-white' : 'text-gray-black',
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>

          <div className="h-px w-full shrink-0 self-stretch bg-border" />

          <section
            aria-labelledby="last-orders-heading"
            className="relative flex w-full flex-[0_0_auto] flex-col items-center self-stretch"
          >
            <div className="relative mb-[-1px] flex w-full flex-[0_0_auto] items-center gap-0.5 self-stretch">
              <h2
                id="last-orders-heading"
                className="relative w-fit whitespace-nowrap text-caption-lg-regular text-gray-500"
              >
                Last Orders
              </h2>
              <div className="relative w-fit whitespace-nowrap text-body-regular text-gray-black">
                37
              </div>
            </div>
            <div className="relative flex w-full flex-[0_0_auto] flex-col items-start self-stretch">
              {LAST_ORDERS.map((order) => (
                <Button
                  key={order.label}
                  type="button"
                  variant="ghost"
                  className={cn(
                    productV2Controls.orderRow,
                    'h-auto justify-start hover:bg-muted/80',
                  )}
                >
                  <span
                    className={productV2Controls.orderThumb}
                    style={{ backgroundImage: `url(${order.imageUrl})` }}
                  />
                  <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-black">
                    {order.label}
                  </span>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        className={cn(
          productV2Controls.logoutRow,
          'h-auto justify-start shadow-none hover:bg-muted/80 focus-visible:ring-offset-0',
        )}
      >
        <span className="relative flex shrink-0 items-center justify-center p-0.5">
          <LogOutIcon className="h-6 w-6 text-gray-black" aria-hidden />
        </span>
        <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-black">
          Logout
        </span>
      </Button>
    </aside>
  );
}
