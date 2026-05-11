import { type JSX } from 'react';

import { productV2Layout, productV2Promo } from '../productV2Classes';
import { PromoCard } from './PromoCard';
import { LEFT_BOTTOM_PROMOS, LEFT_TOP_PROMOS } from './homeDemoData';

export function HomePromoLeftSection(): JSX.Element {
  return (
    <div className={productV2Layout.twoColLeft}>
      <div className={productV2Promo.leftTopStack}>
        {LEFT_TOP_PROMOS.map((model) => (
          <PromoCard key={model.id} model={model} />
        ))}
      </div>
      <div className={productV2Promo.leftBottomRow}>
        {LEFT_BOTTOM_PROMOS.map((model) => (
          <PromoCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
