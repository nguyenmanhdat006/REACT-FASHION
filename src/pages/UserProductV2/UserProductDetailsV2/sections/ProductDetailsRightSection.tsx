import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart, type LucideIcon } from 'lucide-react';

import { IconButton } from '@/components/buttons/IconButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import { useAppDispatch } from '@/store/hooks';
import { addToCartThunk } from '@/store/thunks';
import { ROUTES } from '@/constants';
import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { cn } from '@/lib/utils';

import { ProductDetailsAccordion } from '@/pages/UserProductV2/components/ProductDetailsAccordion';
import { ProductDetailsShippingItem } from '@/pages/UserProductV2/components/ProductDetailsShippingItem';
import type { SizeOption } from '@/utils/product';

export type ProductDetailsRightSectionProps = {
  productId?: string;
  productTitle: string;
  priceLabel: string;
  description: string;
  sizeOptions: SizeOption[];
  shippingItems: readonly {
    title: string;
    value: string;
    Icon: LucideIcon;
  }[];
  onClose?: () => void;
  heroUrl?: string;
};

export default function ProductDetailsRightSection({
  productId,
  productTitle,
  priceLabel,
  description,
  sizeOptions,
  shippingItems,
  onClose,
  heroUrl,
}: ProductDetailsRightSectionProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(() => {
    const first = sizeOptions.find((s) => s.available);
    return first?.label ?? sizeOptions[0]?.label ?? 'S';
  });
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const first = sizeOptions.find((s) => s.available);
    setSelectedSize(first?.label ?? sizeOptions[0]?.label ?? 'S');
  }, [productTitle, sizeOptions]);

  const sizeStripDrag = useHorizontalDragScroll<HTMLDivElement>({
    ignoreDragFromSelector: 'button',
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex w-full shrink-0 flex-col items-start gap-2">
        <h1
          id="product-details-title"
          className="m-0 line-clamp-2 w-full text-h5-medium text-black"
        >
          {productTitle}
        </h1>
        <p className="m-0 whitespace-nowrap text-h5-medium text-black">{priceLabel}</p>
      </div>

      <div className="whitespace-nowrap text-caption-lg-regular leading-5 text-gray-500">
        Select Size
      </div>

      <div
        ref={sizeStripDrag.ref}
        role="group"
        aria-label="Select product size"
        className={cn(
          'flex min-w-0 w-full shrink-0 cursor-grab items-center gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide active:cursor-grabbing',
          'touch-pan-x select-none'
        )}
        onPointerDown={sizeStripDrag.onPointerDown}
        onPointerMove={sizeStripDrag.onPointerMove}
        onPointerUp={sizeStripDrag.onPointerUp}
        onPointerCancel={sizeStripDrag.onPointerCancel}
      >
        {sizeOptions.map((size, index) => {
          const selected = selectedSize === size.label;
          return (
            <LabelButton
              key={`${size.label}-${index}`}
              type="button"
              label={size.label}
              disabled={!size.available}
              tone={size.available && selected ? 'primary' : 'default'}
              aria-label={`Size ${size.label}${!size.available ? ' unavailable' : ''}`}
              aria-pressed={size.available ? selected : undefined}
              onClick={() => {
                if (size.available) setSelectedSize(size.label);
              }}
            />
          );
        })}
      </div>

      <div className="flex w-full shrink-0 items-center gap-2">
        <LabelButton
          label="Add To cart"
          ariaLabel="Add product to cart"
          tone="default"
          className="flex-1"
          onClick={async () => {
            if (!productId) return;
            const result = await dispatch(addToCartThunk({ productId, quantity: 1, productImageUrl: heroUrl } as any));
            if (addToCartThunk.fulfilled.match(result)) {
              toast.success('Added to cart');
            } else if (addToCartThunk.rejected.match(result)) {
              toast.error((result as any).payload || 'Failed to add to cart');
            }
          }}
          disabled={!productId}
        />

        <LabelButton
          label="Buy Now"
          ariaLabel="Buy now"
          tone="primary"
          className="flex-1"
          onClick={async () => {
            if (!productId) return;
            const result = await dispatch(addToCartThunk({ productId, quantity: 1, productImageUrl: heroUrl } as any));
            if (addToCartThunk.fulfilled.match(result)) {
              try {
                onClose?.();
              } catch {
              }
                navigate(ROUTES.CHECKOUT);
            } else if (addToCartThunk.rejected.match(result)) {
              toast.error((result as any).payload || 'Unable to proceed to checkout');
            }
          }}
        />

        <IconButton
          icon={Heart}
          ariaLabel={
            isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
          }
          aria-pressed={isWishlisted}
          onClick={() => setIsWishlisted((prev) => !prev)}
          className={cn(
            'shrink-0 rounded-[60px] bg-[#f5f5f5] px-4 py-4 hover:bg-[#f5f5f5]',
            'shadow-none focus-visible:ring-0'
          )}
          iconClassName={cn(
            'size-6 transition-[fill,color] duration-200',
            isWishlisted
              ? 'fill-[#e53935] text-[#e53935]'
              : 'fill-none text-gray-black'
          )}
        />
      </div>

      <ProductDetailsAccordion
        title="Description"
        isOpen={isDescriptionOpen}
        onToggle={() => setIsDescriptionOpen((prev) => !prev)}
      >
        <p className="w-full text-caption-lg-regular">{description}</p>
      </ProductDetailsAccordion>

      <ProductDetailsAccordion
        title="Shipping"
        isOpen={isShippingOpen}
        onToggle={() => setIsShippingOpen((prev) => !prev)}
      >
        <div className="box-border grid w-full grid-cols-2 gap-x-8 gap-y-2 px-2">
          {shippingItems.map((item) => (
            <ProductDetailsShippingItem
              key={item.title}
              title={item.title}
              value={item.value}
              Icon={item.Icon}
            />
          ))}
        </div>
      </ProductDetailsAccordion>
    </div>
  );
}
