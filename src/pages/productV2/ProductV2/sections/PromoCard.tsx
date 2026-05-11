import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import {
  promoBackgroundImage,
  productV2Controls,
  productV2Promo,
} from '../productV2Classes';
import { ActionIconButton } from './ActionIconButton';
import type { PromoCardModel } from './homeDemoData';

type PromoCardProps = {
  model: PromoCardModel;
};

const promoCardShell = cn(
  'rounded-[32px] border-0 bg-transparent p-0 py-0 text-white shadow-none ring-0 gap-0',
);

export function PromoCard({ model }: PromoCardProps): JSX.Element {
  const imageStyle = promoBackgroundImage(model.imageUrl);
  const bordered = 'bordered' in model && model.bordered;

  if (model.layout === 'discountCta') {
    return (
      <Card
        role="article"
        className={cn(
          promoCardShell,
          productV2Promo.shellDiscountCta,
          bordered && productV2Promo.borderedTile,
        )}
        style={imageStyle}
      >
        <div className="relative flex flex-[0_0_auto] flex-col items-center justify-center gap-2.5">
          {model.titleAsParagraph ? (
            <p className={productV2Promo.titleOnImage}>{model.title}</p>
          ) : (
            <div className={productV2Promo.titleOnImage}>{model.title}</div>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-label={model.buttonText}
          className={cn(productV2Controls.glassCtaWide, 'shadow-none')}
        >
          <span className={productV2Controls.glassCtaLabel}>{model.buttonText}</span>
        </Button>
      </Card>
    );
  }

  if (model.layout === 'offerFavorite') {
    return (
      <Card
        role="article"
        className={cn(
          promoCardShell,
          productV2Promo.shellOfferFavorite,
          bordered && productV2Promo.borderedTile,
        )}
        style={imageStyle}
      >
        <div className={productV2Promo.actionsEndRowFull}>
          <ActionIconButton type="favorite" label="Add to favorites" />
        </div>
        <Button
          type="button"
          variant="secondary"
          aria-label={model.buttonText}
          className={cn(productV2Controls.glassCtaWide, 'shadow-none')}
        >
          <span className={productV2Controls.glassCtaLabel}>{model.buttonText}</span>
        </Button>
      </Card>
    );
  }

  if (model.layout === 'prelineTitleExternal') {
    return (
      <Card
        role="article"
        className={cn(
          promoCardShell,
          productV2Promo.shellPrelineExternal,
          bordered && productV2Promo.borderedTile,
        )}
        style={imageStyle}
      >
        <div className={productV2Promo.flexStackCenter}>
          <div className={productV2Promo.titleBlock}>
            <p className={cn(productV2Promo.titleOnImage, 'whitespace-pre-line')}>
              {model.title}
            </p>
          </div>
        </div>
        <div className={productV2Promo.actionsEndRow}>
          <ActionIconButton type="external" label="Open promotion" />
        </div>
      </Card>
    );
  }

  /* headlineSubtitle */
  const outer = cn(
    promoCardShell,
    model.rowAlign ? productV2Promo.shellHeadlineRow : productV2Promo.shellDiscountCta,
    bordered && productV2Promo.borderedTile,
  );

  return (
    <Card role="article" className={outer} style={imageStyle}>
      <div className="relative flex flex-1 grow flex-col items-center justify-center gap-2.5">
        <div className={productV2Promo.titleBlock}>
          <div className={productV2Promo.titleOnImage}>{model.title}</div>
          <div className={productV2Promo.subtitleOnImage}>{model.subtitle}</div>
        </div>
      </div>
      <div className={productV2Promo.actionsEndRow}>
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
