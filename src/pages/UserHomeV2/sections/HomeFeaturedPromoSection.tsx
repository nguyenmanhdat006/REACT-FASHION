import { type JSX } from 'react';

import { PromoCard } from '@/pages/UserHomeV2/components/PromoCard';
import { FEATURED_PROMO } from '@/pages/UserHomeV2/homeDemoData';

export function HomeFeaturedPromoSection(): JSX.Element {
  return (
    <div className="relative flex w-full flex-1 grow flex-col items-center justify-center gap-2.5 self-stretch">
      <PromoCard model={FEATURED_PROMO} />
    </div>
  );
}
