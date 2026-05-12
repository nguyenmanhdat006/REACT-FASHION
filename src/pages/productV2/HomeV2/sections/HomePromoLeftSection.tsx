import { type JSX } from 'react';

import { PromoCard } from '../../components/PromoCard';
import { LEFT_BOTTOM_PROMOS, LEFT_TOP_PROMOS } from '../../homeDemoData';

export function HomePromoLeftSection(): JSX.Element {
  return (
    <div className="relative flex flex-1 grow flex-col items-center justify-center gap-4 self-stretch">
      <div className="relative flex w-full flex-1 flex-col items-start gap-4 self-stretch">
        {LEFT_TOP_PROMOS.map((model) => (
          <PromoCard key={model.id} model={model} />
        ))}
      </div>
      <div className="relative flex w-full flex-1 grow items-center justify-center gap-4 self-stretch px-0 py-0.5">
        {LEFT_BOTTOM_PROMOS.map((model) => (
          <PromoCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
