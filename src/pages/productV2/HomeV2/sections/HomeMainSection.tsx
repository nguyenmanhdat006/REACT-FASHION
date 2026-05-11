import { type JSX } from 'react';

import { HomeFeaturedPromoSection } from './HomeFeaturedPromoSection';
import { HomeProductCardsSection } from './HomeProductCardsSection';
import { HomePromoLeftSection } from './HomePromoLeftSection';

export function HomeMainSection(): JSX.Element {
  return (
      <main className="relative flex h-[766px] w-full items-center justify-center self-stretch p-8">
        <div className="relative flex max-w-[1148px] flex-1 grow items-center gap-8 self-stretch">
          <HomePromoLeftSection />
          <div className="relative flex flex-1 grow flex-col items-start justify-center gap-4 self-stretch">
            <HomeProductCardsSection />
            <HomeFeaturedPromoSection />
          </div>
        </div>
      </main>
  );
}
