import { type JSX } from 'react';

import { ActionIconButton } from '@/components/buttons/ActionIconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ProductSwatch {
  colorClass: string;
  borderClass?: string;
}

export interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: string;
  description?: string;
  swatches?: ProductSwatch[];
  favoriteLabel?: string;
  priceAriaLabel?: string;
  onFavorite?: () => void;
  onSelectPrice?: () => void;
  className?: string;
}

const DEFAULT_SWATCHES: ProductSwatch[] = [
  { colorClass: 'bg-yellow-300', borderClass: 'border-gray-400' },
  { colorClass: 'bg-gray-black' },
];

export function ProductCard({
  imageUrl,
  title,
  price,
  description = 'Your Choice',
  swatches = DEFAULT_SWATCHES,
  favoriteLabel = 'Add to favorites',
  priceAriaLabel,
  onFavorite,
  onSelectPrice,
  className,
}: ProductCardProps): JSX.Element {
  return (
    <Card
      className={cn(
        'relative flex flex-1 grow flex-col items-center justify-center gap-0 self-stretch overflow-hidden rounded-2xl border border-solid border-gray-50 bg-white p-0',
        className,
      )}
    >
      <div
        className="relative flex h-full min-h-[400px] flex-col items-center gap-2.5 self-stretch bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        <div className="relative flex flex-1 grow flex-col items-center gap-2.5 self-stretch p-4">
          <div className="relative flex w-full items-center justify-between self-stretch">
            <div className="relative inline-flex items-center justify-center gap-1">
              {swatches.map((swatch, index) => (
                <div
                  key={`${swatch.colorClass}-${index}`}
                  className={cn(
                    'relative flex h-6 w-6 items-center justify-center gap-2.5 overflow-hidden rounded-3xl',
                    swatch.colorClass,
                  )}
                >
                  <div
                    className={cn(
                      'relative h-5 w-5 rounded-3xl',
                      swatch.colorClass,
                      swatch.borderClass && `border border-solid ${swatch.borderClass}`,
                    )}
                  />
                </div>
              ))}
            </div>
            <ActionIconButton
              type="favorite"
              label={favoriteLabel}
              onClick={onFavorite}
            />
          </div>
        </div>
      </div>

      <CardContent className="relative flex flex-col gap-2.5 border-0 p-4">
        <div className="relative flex w-full items-center justify-between self-stretch">
          <div className="relative flex flex-col items-start justify-center gap-1">
            <CardDescription className="text-caption-lg-regular text-gray-500">
              {description}
            </CardDescription>
            <CardTitle className="text-body-medium text-gray-black">
              {title}
            </CardTitle>
          </div>
          <LabelButton
            tone="primary"
            label={price}
            ariaLabel={priceAriaLabel ?? `View product price ${price}`}
            onClick={onSelectPrice}
          />
        </div>
      </CardContent>
    </Card>
  );
}
