import { type JSX } from 'react';

import { ProductDetailsImage } from '../../components/ProductDetailsImage';

export type ProductDetailsLeftSectionProps = {
  heroImageUrl: string;
  thumbnailUrls: string[];
  galleryAriaLabel: string;
};

export default function ProductDetailsLeftSection({
  heroImageUrl,
  thumbnailUrls,
  galleryAriaLabel,
}: ProductDetailsLeftSectionProps): JSX.Element {
  return (
    <ProductDetailsImage
      heroImageUrl={heroImageUrl}
      thumbnailUrls={thumbnailUrls}
      galleryAriaLabel={galleryAriaLabel}
    />
  );
}
