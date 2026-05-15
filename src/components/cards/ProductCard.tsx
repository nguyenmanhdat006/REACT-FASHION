import { type JSX, type MouseEvent } from 'react';

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
  /** When provided, passed to `onOpenDetails` so the modal can load this product. */
  productId?: string;
  onOpenDetails?: (productId?: string) => void;
  className?: string;
}

const DEFAULT_SWATCHES: ProductSwatch[] = [
  { colorClass: 'bg-yellow-300', borderClass: 'border-gray-400' },
  { colorClass: 'bg-gray-black' },
];

const CARD_HOVER =
  'transition-[transform,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-gray-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0';

const MEDIA_HOVER =
  'pointer-events-none absolute inset-0 bg-cover bg-top transition-[transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100';

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
  onOpenDetails,
  productId,
  className,
}: ProductCardProps): JSX.Element {
  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onOpenDetails) return;
    const t = event.target as HTMLElement;
    if (t.closest('[data-product-card-interactive]')) return;
    onOpenDetails(productId);
  };

  return (
    <Card
      className={cn(
        'relative flex flex-1 grow flex-col items-center justify-center gap-0 self-stretch overflow-hidden rounded-2xl border border-solid border-gray-50 bg-white p-0',
        CARD_HOVER,
        onOpenDetails && 'cursor-pointer',
        className,
      )}
      onClick={handleCardClick}
    >
      <div className="relative flex min-h-[400px] flex-1 flex-col items-center gap-2.5 self-stretch overflow-hidden">
        <div
          aria-hidden
          className={MEDIA_HOVER}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
          }}
        />
        <div className="relative z-10 flex flex-1 grow flex-col items-center gap-2.5 self-stretch p-4">
          <div
            className="relative flex w-full items-center justify-between self-stretch"
            data-product-card-interactive
          >
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

      <CardContent className="relative z-10 flex flex-col gap-2.5 border-0 border-t border-transparent bg-white p-4 transition-colors duration-300 group-hover/card:border-gray-50">
        <div className="relative flex w-full items-center justify-between self-stretch">
          <div className="relative flex min-w-0 flex-1 flex-col items-start justify-center gap-1 pr-2">
            <CardDescription className="text-caption-lg-regular text-gray-500">
              {description}
            </CardDescription>
            <CardTitle className="line-clamp-2 text-body-medium text-gray-black">
              {title}
            </CardTitle>
          </div>
          <div data-product-card-interactive>
            <LabelButton
              tone="primary"
              label={price}
              ariaLabel={priceAriaLabel ?? `View product price ${price}`}
              onClick={onSelectPrice}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
