import { Bell, Search, ShoppingCart } from 'lucide-react';
import type { JSX } from 'react';

import { IconButton } from '@/components/buttons/IconButton';
import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { IMAGES } from '@/constants/images';

import { OrderStats } from './components/OrderStats';
import { UserButton } from './components/UserButton';

export function HomeHeaderSection(): JSX.Element {
  return (
    <header className="relative flex self-stretch flex-col items-center justify-center border-b border-solid border-gray-100 bg-white px-8 pb-4 pt-8">
      <div className="relative flex max-w-[1212px] w-full flex-col items-start gap-8 justify-between">
        <div className="relative flex items-center justify-between self-stretch">
          <OrderStats orderCount={37} period="Last 7 days" label="Orders" />

          <div className="relative inline-flex items-center gap-2 self-stretch justify-center">
            <IconButton icon={Bell} ariaLabel="Notifications" />
            <IconLabelButton
              icon={ShoppingCart}
              label="Cart"
              ariaLabel="Open cart"
            />
            <UserButton userName="Tường" avatarUrl={IMAGES.USER_AVATAR} />
          </div>
        </div>

        <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
          <h3 className="relative w-fit whitespace-nowrap text-h3-medium text-gray-black">
            Home
          </h3>
          <div className="relative flex w-[188px] items-center justify-center gap-2">
            <LabelButton
              label="Filters"
              ariaLabel="Open filters"
              className="flex-1 grow"
            />
            <IconButton
              icon={Search}
              ariaLabel="Search"
              className="px-3 py-3"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
