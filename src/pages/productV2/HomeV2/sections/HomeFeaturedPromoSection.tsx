import { type JSX } from 'react';

import { PromoCard } from '../components/PromoCard';
import { FEATURED_PROMO } from '../homeDemoData';

export function HomeFeaturedPromoSection(): JSX.Element {
  return (
    <div className="relative flex w-full flex-1 grow flex-col items-center justify-center gap-2.5 self-stretch">
      <PromoCard model={FEATURED_PROMO} />
    </div>
  );
}
