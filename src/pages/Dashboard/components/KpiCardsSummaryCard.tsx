import type { JSX } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TrendType = 'up' | 'down';

type KpiCardSummary = {
  title: string;
  value: string;
  Icon: any;
  iconBg: string;
  iconColor: string;
  trendValue: string;
  trendLabel: string;
  trendType: TrendType;
};

type KpiCardsSummaryCardProps = {
  card: KpiCardSummary;
};

const trendIconClassName = 'h-5 w-5';

function TrendIcon({ trendType }: { trendType: TrendType }): JSX.Element {
  if (trendType === 'down') {
    return <TrendingDown className={cn(trendIconClassName, 'text-[#F93C65]')} aria-hidden="true" />;
  }

  return <TrendingUp className={cn(trendIconClassName, 'text-[#00B69B]')} aria-hidden="true" />;
}

export function KpiCardsSummaryCard({ card }: KpiCardsSummaryCardProps): JSX.Element {
  const Icon = card.Icon;
  return (
    <Card
      className="overflow-hidden rounded-[14px] border-none bg-white shadow-[6px_6px_54px_#0000000d] transition-all hover:shadow-lg"
      aria-label={`${card.title}: ${card.value}`}
    >
      <CardContent className="flex h-[161px] flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-base font-semibold leading-normal tracking-[0] text-[#202224] opacity-70">
              {card.title}
            </h3>
            <p className="font-sans text-[28px] font-bold leading-normal tracking-[1.00px] text-[#202224]">
              {card.value}
            </p>
          </div>

          <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl', card.iconBg)}>
            <Icon className={cn('h-7 w-7', card.iconColor)} />
          </div>
        </div>

        <div className="flex items-center gap-2" aria-label={`${card.trendValue} ${card.trendLabel}`}>
          <div className="flex h-6 w-6 items-center justify-center">
            <TrendIcon trendType={card.trendType} />
          </div>
          <p className="font-sans text-base font-semibold leading-normal tracking-[0] text-[#606060]">
            <span className={card.trendType === 'up' ? 'text-[#00b69b]' : 'text-[#f93c65]'}>
              {card.trendValue}
            </span>
            <span className="text-[#12153c]">&nbsp;</span>
            <span>{card.trendLabel}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}