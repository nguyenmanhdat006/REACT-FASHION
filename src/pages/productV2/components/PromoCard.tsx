import { type JSX } from 'react';

import { ActionIconButton } from '@/components/buttons/ActionIconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { PromoCardModel } from '../homeDemoData';

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

const PROMO_BG_ZOOM =
  'pointer-events-none absolute inset-0 -z-0 bg-cover transition-[transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100';

export function PromoCard({ model }: PromoCardProps): JSX.Element {
  const imageStyle = promoBg(model.imageUrl);
  const hasBorder = 'bordered' in model && model.bordered;

  if (model.layout === 'discountCta') {
    return (
      <Card
        role="article"
        className={cn(
          'rounded-[32px] border-0 bg-transparent p-0 py-0 text-white shadow-none ring-0 gap-0',
          'relative flex w-full flex-1 grow flex-col items-center justify-center gap-2 self-stretch overflow-hidden p-4',
          hasBorder && 'border border-solid border-gray-50',
        )}
      >
        <div aria-hidden className={cn(PROMO_BG_ZOOM)} style={imageStyle} />
        <div className="relative z-10 flex flex-col items-center justify-center gap-2.5">
          {model.titleAsParagraph ? (
            <p className="text-h5-medium text-white relative self-stretch">{model.title}</p>
          ) : (
            <div className="text-h6-medium text-white relative self-stretch">{model.title}</div>
          )}
        </div>
        <LabelButton
          tone="muted"
          label={model.buttonText}
          className="relative z-10"
        />
      </Card>
    );
  }

  if (model.layout === 'offerFavorite') {
    const offerBg = { ...imageStyle, backgroundPosition: 'top' as const };
    return (
      <Card
        role="article"
        className={cn(
          'rounded-[32px] text-white',
          'relative flex w-full flex-1 grow flex-col items-center justify-between self-stretch overflow-hidden p-4',
          hasBorder && 'border border-solid border-gray-50',
        )}
      >
        <div aria-hidden className={PROMO_BG_ZOOM} style={offerBg} />
        <div className="relative z-10 flex w-full flex-1 flex-col justify-between gap-2.5 self-stretch">
          <div className="flex w-full items-start justify-end gap-2.5 self-stretch">
            <ActionIconButton type="favorite" label="Add to favorites" />
          </div>
          <LabelButton tone="muted" label={model.buttonText} />
        </div>
      </Card>
    );
  }

  if (model.layout === 'prelineTitleExternal') {
    return (
      <Card
        role="article"
        className={cn(
          'rounded-[32px] border-0 bg-transparent p-0 py-0 text-white shadow-none ring-0 gap-0',
          'relative flex w-full flex-1 flex-row grow items-center justify-between self-stretch overflow-hidden p-4',
          hasBorder && 'border border-solid border-gray-50',
        )}
      >
        <div aria-hidden className={cn(PROMO_BG_ZOOM)} style={imageStyle} />
        <div className="relative z-10 flex w-full flex-1 flex-row grow items-center justify-between self-stretch">
          <div className="relative flex grow w-fit max-w-[50%] items-center justify-center">
            <div className="relative flex w-full flex-col items-start justify-center">
              <p className="text-h5-medium text-white max-w-[50%] relative whitespace-pre-line">
                {model.title}
              </p>
            </div>
          </div>
          <div className="inline-flex items-start justify-end gap-2.5 self-stretch">
            <ActionIconButton type="external" label="Open promotion" />
          </div>
        </div>
      </Card>
    );
  }

  const heroBg = { ...imageStyle, backgroundPosition: 'center 30%' as const };

  return (
    <Card
      role="article"
      className={cn(
        'rounded-[32px] border-0 bg-transparent p-0 py-0 text-white shadow-none ring-0 gap-0',
        model.rowAlign
          ? 'relative flex w-full flex-1 flex-row grow items-center justify-between self-stretch overflow-hidden p-4'
          : 'relative flex w-full flex-1 grow flex-col items-center justify-center gap-2 self-stretch overflow-hidden p-4',
        hasBorder && 'border border-solid border-gray-50',
      )}
    >
      <div aria-hidden className={cn(PROMO_BG_ZOOM)} style={heroBg} />
      <div
        className={cn(
          'relative z-10 flex w-full flex-1 self-stretch',
          model.rowAlign
            ? 'flex-row items-center justify-between gap-2.5'
            : 'flex-col justify-between gap-2.5',
        )}
      >
        <div className="relative flex min-h-0 flex-1 flex-col items-start justify-center gap-1 self-stretch">
          <div className="text-h5-medium text-white relative self-stretch">{model.title}</div>
          <div className="text-body-regular text-white relative self-stretch">
            {model.subtitle}
          </div>
        </div>
        <div className="inline-flex items-start justify-end gap-2.5 self-stretch">
          <ActionIconButton
            type={model.actionIcon}
            label={
              model.actionIcon === 'external' ? 'Open promotion' : 'Add to favorites'
            }
          />
        </div>
      </div>
    </Card>
  );
}
