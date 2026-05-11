import { Bell, Search, ShoppingCart } from 'lucide-react';
import type { JSX } from 'react';

import { Button } from '@/components/ui/button';
import { IMAGES } from '@/constants/images';
import { cn } from '@/lib/utils';

import { OrderStats } from './components/OrderStats';
import { UserButton } from './components/UserButton';

export function HomeHeaderSection(): JSX.Element {
  return (
    <header className="relative flex self-stretch flex-col items-center justify-center border-b border-solid border-gray-100 bg-white px-8 pb-4 pt-8">
      <div className="relative flex max-w-[1212px] w-full flex-col items-start gap-8 justify-between">
        <div className="relative flex items-center justify-between self-stretch">
          <OrderStats orderCount={37} period="Last 7 days" label="Orders" />

          <div className="relative inline-flex items-center gap-2 self-stretch justify-center">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              aria-label="Notifications"
              className="h-auto rounded-full px-4 py-4 bg-gray-50 hover:bg-gray-100"
            >
              <Bell aria-hidden className="size-6 text-gray-black" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              aria-label="Open cart"
              className="h-auto gap-2 rounded-2xl px-4 py-4 text-body-regular text-gray-black bg-gray-50 hover:bg-gray-100"
            >
              <ShoppingCart aria-hidden className="size-6 text-gray-black" />
              <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-black">
                Cart
              </span>
            </Button>
            <UserButton userName="Tường" avatarUrl={IMAGES.USER_AVATAR} />
          </div>
        </div>

        <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
          <h3 className="relative w-fit whitespace-nowrap text-h3-medium text-gray-black">
            Home
          </h3>
          <div className="relative flex w-[188px] items-center justify-center gap-2">
            <Button
              type="button"
              variant="ghost"
              aria-label="Open filters"
              className={cn(
                'relative flex flex-1 grow h-auto items-center justify-center overflow-hidden rounded-[32px] bg-gray-50 px-8 py-3',
                'hover:bg-gray-100',
              )}
            >
              <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-black">
                Filters
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              aria-label="Search"
              className="h-auto rounded-full px-3 py-3 bg-gray-50 hover:bg-gray-100"
            >
              <Search aria-hidden className="size-6 text-gray-black" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
