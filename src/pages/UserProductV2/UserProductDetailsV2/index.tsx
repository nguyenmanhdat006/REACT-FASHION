import { useEffect, useMemo, type JSX } from 'react';

import { IMAGES } from '@/constants/images';
import { useProducts } from '@/hooks/product/useProducts';
import { useAppSelector } from '@/store/hooks';

import {
  collectProductGalleryUrls,
  formatProductPriceUsd,
  getPrimaryProductImageUrl,
  variantsToSizeOptions,
  type SizeOption,
} from '@/utils/product';

import ProductDetailsHeaderSection from './sections/ProductDetailsHeaderSection';
import { cn } from '@/lib/utils';
import ProductDetailsLeftSection from './sections/ProductDetailsLeftSection';
import ProductDetailsRightSection from './sections/ProductDetailsRightSection';
import { SIZE_OPTIONS, SHIPPING_ITEMS } from './constants';

export type UserProductDetailsV2Props = {
  onClose?: () => void;
  /** When set, loads product from Product Service; otherwise static demo content is shown. */
  productId?: string;
};

const DEFAULT_TITLE = 'Supper Skinny jogger in brown';
const DEFAULT_PRICE = '$36';
const DEFAULT_DESCRIPTION =
  'A hoodie is a casual and comfortable sweatshirt made from soft, warm fabric, typically featuring a front pocket and an adjustable drawstring hood. It is designed for everyday wear, providing both style and practicality.';

const FALLBACK_THUMBS = [
  IMAGES.PRODUCT_DEMO_1,
  IMAGES.PRODUCT_DEMO_2,
  IMAGES.PROMO_TILE,
  IMAGES.PRODUCT_DEMO_1,
  IMAGES.PRODUCT_DEMO_2,
  IMAGES.PROMO_TILE,
] as const;

export function UserProductDetailsV2({
  onClose,
  productId,
}: UserProductDetailsV2Props): JSX.Element {
  const { fetchProductById, clearDetail } = useProducts();
  const product = useAppSelector(s => s.products.productDetail);

  useEffect(() => {
    if (!productId) {
      clearDetail();
      return;
    }
    void fetchProductById(productId);
  }, [productId, fetchProductById, clearDetail]);

  const view = useMemo(() => {
    if (!productId || !product || product.id !== productId) {
      return {
        title: DEFAULT_TITLE,
        priceLabel: DEFAULT_PRICE,
        description: DEFAULT_DESCRIPTION,
        heroUrl: IMAGES.PRODUCT_DEMO_1,
        thumbUrls: [...FALLBACK_THUMBS],
        sizeOptions: [...SIZE_OPTIONS] as SizeOption[],
        galleryAriaLabel: `${DEFAULT_TITLE} — product gallery`,
      };
    }

    const hero = getPrimaryProductImageUrl(product, IMAGES.PRODUCT_DEMO_1);
    const thumbs = collectProductGalleryUrls(product, hero);
    const sizeOptions = variantsToSizeOptions(product.variants, SIZE_OPTIONS);

    return {
      title: product.name,
      priceLabel: formatProductPriceUsd(product.price),
      description:
        (typeof product.description === 'string' && product.description.trim()) ||
        product.shortDescription?.trim() ||
        DEFAULT_DESCRIPTION,
      heroUrl: hero,
      thumbUrls: thumbs.length >= 2 ? thumbs : [...thumbs, ...FALLBACK_THUMBS].slice(0, 6),
      sizeOptions,
      galleryAriaLabel: `${product.name} — product gallery`,
    };
  }, [product, productId]);

  return (
    <main
      className={cn(
        'mx-auto box-border flex w-auto max-w-full flex-col items-center gap-4 overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-0'
      )}
    >
      <ProductDetailsHeaderSection onClose={onClose} />

      <section className="flex w-auto items-start gap-4 self-stretch">
        <ProductDetailsLeftSection
          heroImageUrl={view.heroUrl}
          thumbnailUrls={view.thumbUrls}
          galleryAriaLabel={view.galleryAriaLabel}
        />
        <ProductDetailsRightSection
          productId={product?.id}
          productTitle={view.title}
          priceLabel={view.priceLabel}
          description={view.description}
          sizeOptions={view.sizeOptions}
          shippingItems={SHIPPING_ITEMS}
        />
      </section>
    </main>
  );
}

export default UserProductDetailsV2;
