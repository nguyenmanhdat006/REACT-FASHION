import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { productV2Product, productV2Promo } from '../productV2Classes';
import { ActionIconButton } from './ActionIconButton';
import { PRODUCT_TILES } from './homeDemoData';

export function HomeProductCardsSection(): JSX.Element {
  return (
    <div className={productV2Product.gridRow}>
      {PRODUCT_TILES.map((product) => (
        <Card key={product.id} className={productV2Product.card}>
          <div
            className={cn(productV2Product.cardImageWrap, productV2Promo.baseCover)}
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={productV2Product.cardImageInner}>
              <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
                <div className="relative inline-flex flex-[0_0_auto] items-center justify-center gap-1">
                  <div className="relative flex h-6 w-6 items-center justify-center gap-2.5 overflow-hidden rounded-3xl bg-yellow-300">
                    <div className="relative h-5 w-5 rounded-3xl border border-solid border-gray-400 bg-yellow-300" />
                  </div>
                  <div className="relative flex h-6 w-6 items-center justify-center gap-2.5 overflow-hidden rounded-3xl bg-gray-black">
                    <div className="relative h-5 w-5 rounded-3xl bg-gray-black" />
                  </div>
                </div>
                <ActionIconButton type="favorite" label="Add to favorites" />
              </div>
            </div>
          </div>
          <CardContent className={cn(productV2Product.metaRow, 'border-0 p-4 pb-4 pt-4')}>
            <div className="relative flex w-full flex-[0_0_auto] items-center justify-between self-stretch">
              <div className="relative flex max-w-[140px] w-[140px] flex-col items-center justify-center gap-1">
                <CardDescription className="text-caption-lg-regular text-gray-500">
                  Your Choice
                </CardDescription>
                <CardTitle className="text-body-medium text-gray-black">
                  {product.title}
                </CardTitle>
              </div>
              <Button
                type="button"
                variant="default"
                aria-label={`View product price ${product.price}`}
                className={cn(
                  'h-auto flex-[0_0_auto] shrink-0 rounded-[32px] border-0 bg-gray-black px-8 py-3 text-body-regular shadow-none hover:bg-gray-900',
                  'text-white hover:text-white [&_svg]:text-white',
                )}
              >
                {product.price}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
