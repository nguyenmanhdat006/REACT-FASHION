import { type JSX } from 'react';

import { productV2Layout } from '../productV2Classes';
import { HomeFeaturedPromoSection } from './HomeFeaturedPromoSection';
import { HomeHeaderSection } from './HomeHeaderSection';
import { HomeProductCardsSection } from './HomeProductCardsSection';
import { HomePromoLeftSection } from './HomePromoLeftSection';

export function HomeMainSection(): JSX.Element {
  return (
    <section
      className={productV2Layout.mainColumn}
      aria-label="Home page promotions and products"
    >
      <HomeHeaderSection />
      <main className={productV2Layout.homeBody}>
        <div className={productV2Layout.homeBodyInner}>
          <HomePromoLeftSection />
          <div className={productV2Layout.twoColRight}>
            <HomeProductCardsSection />
            <HomeFeaturedPromoSection />
          </div>
        </div>
      </main>
    </section>
  );
}
