import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ActionIconButton } from './ActionIconButton';
import type { PromoCardModel } from './homeDemoData';

type PromoCardProps = {
  model: PromoCardModel;
};

function promoBg(imageUrl: string) {
  return {
    backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as const;
}

const promoShell = cn(
  'rounded-[32px] border-0 bg-transparent p-0 py-0 text-white shadow-none ring-0 gap-0',
);

const titleOnImage = 'text-h5-medium text-white relative self-stretch';
const subtitleOnImage = 'text-body-regular text-white relative self-stretch';
const bordered = 'border border-solid border-gray-50';

const shellDiscountCta = cn(
  'relative flex w-full flex-1 grow flex-col items-center justify-center gap-2 self-stretch overflow-hidden p-4',
);
const shellHeadlineRow = cn(
  'relative flex w-full flex-1 grow items-center justify-center gap-[93px] self-stretch overflow-hidden p-4',
);
const shellOfferFavorite = cn(
  'relative flex w-full flex-1 grow flex-col items-center justify-between self-stretch overflow-hidden p-4',
);
const shellPrelineExternal = cn(
  'relative flex w-full flex-1 grow items-center justify-center gap-[93px] self-stretch overflow-hidden p-4',
);

export function PromoCard({ model }: PromoCardProps): JSX.Element {
  const imageStyle = promoBg(model.imageUrl);
  const hasBorder = 'bordered' in model && model.bordered;

  if (model.layout === 'discountCta') {
    return (
      <Card
        role="article"
        className={cn(promoShell, shellDiscountCta, hasBorder && bordered)}
        style={imageStyle}
      >
        <div className="relative flex flex-[0_0_auto] flex-col items-center justify-center gap-2.5">
          {model.titleAsParagraph ? (
            <p className={titleOnImage}>{model.title}</p>
          ) : (
            <div className={titleOnImage}>{model.title}</div>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-label={model.buttonText}
          className="relative flex h-auto w-[188px] flex-[0_0_auto] shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-[32px] bg-gray-50/70 px-8 py-3 shadow-none"
        >
          <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-500">
            {model.buttonText}
          </span>
        </Button>
      </Card>
    );
  }

  if (model.layout === 'offerFavorite') {
    return (
      <Card
        role="article"
        className={cn(promoShell, shellOfferFavorite, hasBorder && bordered)}
        style={imageStyle}
      >
        <div className="flex flex-[0_0_auto] w-full items-start justify-end gap-2.5 self-stretch">
          <ActionIconButton type="favorite" label="Add to favorites" />
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-label={model.buttonText}
          className="relative flex h-auto w-[188px] flex-[0_0_auto] shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-[32px] bg-gray-50/70 px-8 py-3 shadow-none"
        >
          <span className="relative w-fit whitespace-nowrap text-body-regular text-gray-500">
            {model.buttonText}
          </span>
        </Button>
      </Card>
    );
  }

  if (model.layout === 'prelineTitleExternal') {
    return (
      <Card
        role="article"
        className={cn(promoShell, shellPrelineExternal, hasBorder && bordered)}
        style={imageStyle}
      >
        <div className="relative flex flex-1 grow flex-col items-center justify-center gap-2.5">
          <div className="relative flex w-full flex-[0_0_auto] flex-col items-start justify-center self-stretch">
            <p className={cn(titleOnImage, 'whitespace-pre-line')}>{model.title}</p>
          </div>
        </div>
        <div className="inline-flex flex-[0_0_auto] items-start justify-end gap-2.5 self-stretch">
          <ActionIconButton type="external" label="Open promotion" />
        </div>
      </Card>
    );
  }

  const outer = cn(
    promoShell,
    model.rowAlign ? shellHeadlineRow : shellDiscountCta,
    hasBorder && bordered,
  );

  return (
    <Card role="article" className={outer} style={imageStyle}>
      <div className="relative flex flex-1 grow flex-col items-center justify-center gap-2.5">
        <div className="relative flex w-full flex-[0_0_auto] flex-col items-start justify-center self-stretch">
          <div className={titleOnImage}>{model.title}</div>
          <div className={subtitleOnImage}>{model.subtitle}</div>
        </div>
      </div>
      <div className="inline-flex flex-[0_0_auto] items-start justify-end gap-2.5 self-stretch">
        <ActionIconButton
          type={model.actionIcon}
          label={
            model.actionIcon === 'external' ? 'Open promotion' : 'Add to favorites'
          }
        />
      </div>
    </Card>
  );
}
