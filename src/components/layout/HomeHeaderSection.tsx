import {
  Bell,
  Layers2,
  Mars,
  Search,
  ShoppingCart,
  Venus,
  type LucideIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@/components/buttons/IconButton';
import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/auth/useAuth';

import { useExploreFilters } from '@/pages/UserProductV2/exploreFilters';
import { getCurrentRoute } from '@/routes/appShellRoutes';

import { OrderStats } from './components/OrderStats';
import { UserAccountMenu } from './components/UserAccountMenu';

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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const route = getCurrentRoute(location.pathname);
  const title = route?.headerTitle ?? 'Unknown';
  const {
    onExploreRoute,
    quickSegment: quickFilter,
    activeFilterCount: exploreFilterCount,
    openPanel,
    setQuickSegment,
  } = useExploreFilters();

  useEffect(() => {
    if (!onExploreRoute) return;
    setQuickSegment('all');
    // Reset quick segment when switching between explore routes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on path change
  }, [location.pathname]);

  const headerDisplayName = user
    ? user.fullName?.trim() || user.email?.split('@')[0] || 'Account'
    : isAuthenticated
      ? 'Account'
      : 'Sign in';

  const resolvedAvatar = user?.avatarUrl ?? null;

  const showFiltersRow = Boolean(route?.showHeaderFiltersRow);

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
              onClick={() => navigate(ROUTES.CART)}
            />
            <UserAccountMenu
              isAuthenticated={isAuthenticated || Boolean(user)}
              userName={headerDisplayName}
              avatarUrl={resolvedAvatar}
              roles={user?.roles}
            />
          </div>
        </div>

        <div className="relative flex min-h-11 w-full flex-[0_0_auto] items-center justify-between gap-4 self-stretch">
          <h3 className="relative z-[1] w-fit shrink-0 whitespace-nowrap text-h3-medium text-gray-black">
            {title}
          </h3>
          <div id="header-actions-portal" className="flex flex-1 items-center justify-start ml-12 md:ml-24 z-[1]"></div>

          {onExploreRoute ? (
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
                    onClick={() => setQuickSegment(id)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {showFiltersRow ? (
            <div className="relative z-[1] ml-auto flex w-[188px] shrink-0 items-center justify-end gap-2">
              <LabelButton
                label={
                  onExploreRoute && exploreFilterCount > 0
                    ? `Filters (${exploreFilterCount})`
                    : 'Filters'
                }
                ariaLabel="Open filters"
                className="min-w-0 flex-1 grow"
                onClick={() => {
                  if (onExploreRoute) openPanel();
                }}
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
