import { type JSX } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ActionIconButton } from '../components/ActionIconButton';
import { PRODUCT_TILES } from '../homeDemoData';

export function HomeProductCardsSection(): JSX.Element {
  return (
    <div className="relative flex flex-[3] w-full items-center justify-center gap-4">
      {PRODUCT_TILES.map((product) => (
        <Card
          key={product.id}
          className={cn(
            'relative flex flex-1 grow flex-col bg-white items-center justify-center gap-0 self-stretch overflow-hidden rounded-2xl border border-solid border-gray-50 p-0',
          )}
        >
          <div
            className="relative flex flex-col h-full items-center gap-2.5 self-stretch bg-cover bg-center"
            style={{
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
            }}
          >
            <div className="relative flex flex-1 grow flex-col items-center gap-2.5 p-4 self-stretch">
              <div className="relative flex w-full items-center justify-between self-stretch">
                <div className="relative inline-flex items-center justify-center gap-1">
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
          <CardContent className="relative flex flex-col gap-2.5 border-0 p-4">
            <div className="relative flex w-full items-center justify-between self-stretch">
              <div className="relative flex flex-col items-start justify-center gap-1">
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
                  'h-auto rounded-[32px] border-0 px-8 py-3 text-body-regular',
                  'text-white hover:bg-primary/80',
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
