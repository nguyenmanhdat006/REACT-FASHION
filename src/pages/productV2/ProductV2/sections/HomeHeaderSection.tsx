import { Bell, Search, ShoppingCart } from 'lucide-react';
import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/constants/images';

import { productV2Controls, productV2Header } from '../productV2Classes';

export function HomeHeaderSection(): JSX.Element {
  return (
    <header className={productV2Header.shell}>
      <div className={productV2Header.inner}>
        <div className={productV2Header.row}>
          <div className={productV2Header.statCluster}>
            <div className={productV2Header.statValue}>37</div>
            <div className={productV2Header.statDivider} aria-hidden="true" />
            <div className={productV2Header.statLabelCol}>
              <div className={productV2Header.statLabelTitle}>Orders</div>
              <div className={productV2Header.statLabelHint}>Last 7 days</div>
            </div>
          </div>
          <div className={productV2Header.actionsRow}>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              aria-label="Notifications"
              className={cn(
                'h-auto flex-[0_0_auto] shrink-0 rounded-[60px] px-4 py-4 [&_svg]:size-6',
              )}
            >
              <Bell aria-hidden />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              aria-label="Open cart"
              className={cn(
                'h-auto flex-[0_0_auto] shrink-0 gap-3 rounded-2xl px-4 py-4 text-body-regular text-gray-black [&_svg]:size-6',
              )}
            >
              <ShoppingCart aria-hidden />
              <span className={productV2Controls.profileName}>Cart</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-label="Open profile for Tường"
              className={cn(
                productV2Controls.profileButton,
                'h-auto shrink-0 gap-2 hover:bg-accent/80',
              )}
            >
              <span
                className={productV2Controls.profileAvatar}
                style={{ backgroundImage: `url(${IMAGES.USER_AVATAR})` }}
                aria-hidden
              />
              <span className={productV2Controls.profileName}>Tường</span>
            </Button>
          </div>
        </div>

        <div className={productV2Header.row}>
          <h1 className={productV2Header.pageTitle}>Home</h1>
          <div className={productV2Header.filterCluster}>
            <Button
              type="button"
              variant="secondary"
              aria-label="Open filters"
              className={cn(
                productV2Controls.softCtaWide,
                'h-auto min-h-11 shadow-none [&_svg]:size-6',
              )}
            >
              <span className={productV2Controls.softCtaLabel}>Filters</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              aria-label="Search"
              className={cn(
                'h-auto flex-[0_0_auto] shrink-0 rounded-[60px] px-4 py-4 [&_svg]:size-6',
              )}
            >
              <Search aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
