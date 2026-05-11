import {
  Bell,
  Layers2,
  Mars,
  Search,
  ShoppingCart,
  Venus,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useLocation } from 'react-router-dom';

import { IconButton } from '@/components/buttons/IconButton';
import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { IMAGES } from '@/constants/images';

import { getCurrentRoute } from '@/routes/v2/appShellRoutes';

import { OrderStats } from './components/OrderStats';
import { UserButton } from './components/UserButton';

type QuickFilterId = 'all' | 'men' | 'women';

const QUICK_FILTERS: {
  id: QuickFilterId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: 'all', label: 'All', icon: Layers2 },
  { id: 'men', label: 'Men', icon: Mars },
  { id: 'women', label: 'Women', icon: Venus },
];

export function HomeHeaderSection(): JSX.Element {
  const location = useLocation();
  const route = getCurrentRoute(location.pathname);
  const title = route?.headerTitle ?? 'Unknown';
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>('all');

  useEffect(() => {
    setQuickFilter('all');
  }, [location.pathname]);

  const showFiltersRow = Boolean(route?.showHeaderFiltersRow);
  const showQuickFilter = Boolean(route?.showQuickFilter);

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

        <div className="relative flex min-h-11 w-full flex-[0_0_auto] items-center justify-between gap-4 self-stretch">
          <h3 className="relative z-[1] w-fit shrink-0 whitespace-nowrap text-h3-medium text-gray-black">
            {title}
          </h3>

          {showQuickFilter ? (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-[1] flex -translate-x-1/2 -translate-y-1/2 justify-center"
              role="group"
              aria-label="Quick category filters"
            >
              <div className="pointer-events-auto flex items-center gap-2">
                {QUICK_FILTERS.map(({ id, label, icon }) => (
                  <IconLabelButton
                    key={id}
                    icon={icon}
                    label={label}
                    ariaLabel={`Filter by ${label}`}
                    pillVariant={quickFilter === id ? 'selected' : 'muted'}
                    size="sm"
                    className="rounded-full px-4 py-2.5"
                    iconClassName="size-5"
                    labelClassName="text-caption-lg-regular"
                    onClick={() => setQuickFilter(id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {showFiltersRow ? (
            <div className="relative z-[1] ml-auto flex w-[188px] shrink-0 items-center justify-end gap-2">
              <LabelButton
                label="Filters"
                ariaLabel="Open filters"
                className="min-w-0 flex-1 grow"
              />
              <IconButton
                icon={Search}
                ariaLabel="Search"
                className="px-3 py-3"
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}