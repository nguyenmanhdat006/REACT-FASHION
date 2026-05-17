import type { AdminProductGalleryPreviews } from '../types';

// Get the indices of the product images that are not the cover
export function nonCoverIndices(productImages: string[], coverIndex: number): number[] {
  return productImages.map((_, i) => i).filter(i => i !== coverIndex);
}

// Build the gallery previews
export function buildGalleryPreviews(
  productImages: string[],
  coverIndex: number
): AdminProductGalleryPreviews {
  const othersUrls = nonCoverIndices(productImages, coverIndex).map(i => productImages[i]);
  return {
    slot0: othersUrls[0] ?? null,
    slot1: othersUrls[1] ?? null,
    slot2: othersUrls[2] ?? null,
    moreCount: Math.max(0, othersUrls.length - 3),
  };
}

// Calculate the new cover index after removing an image
// cover is alway 0
export function coverIndexAfterRemove(
  coverIndex: number,
  removedIndex: number
): number {
  if (removedIndex === coverIndex) return 0;
  if (removedIndex < coverIndex) return Math.max(0, coverIndex - 1);
  return coverIndex;
}
