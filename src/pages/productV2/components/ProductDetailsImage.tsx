import { type JSX } from 'react';

import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { cn } from '@/lib/utils';

export type ProductDetailsImageProps = {
  heroImageUrl: string;
  thumbnailUrls: string[];
  galleryAriaLabel: string;
};

export function ProductDetailsImage({
  heroImageUrl,
  thumbnailUrls,
  galleryAriaLabel,
}: ProductDetailsImageProps): JSX.Element {
  const stripDrag = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div
      className={cn(
        'flex min-w-0 border border-gray-200 flex-1 flex-col justify-end self-stretch overflow-hidden rounded-2xl bg-cover bg-top p-4'
      )}
      style={{ backgroundImage: `url(${heroImageUrl})` }}
      aria-label={galleryAriaLabel}
    >
      <div
        ref={stripDrag.ref}
        className={cn(
          'flex w-full min-w-0 cursor-grab gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide active:cursor-grabbing',
          'touch-pan-x select-none'
        )}
        role="list"
        aria-label="Product image thumbnails, drag horizontally to scroll"
        onPointerDown={stripDrag.onPointerDown}
        onPointerMove={stripDrag.onPointerMove}
        onPointerUp={stripDrag.onPointerUp}
        onPointerCancel={stripDrag.onPointerCancel}
      >
        {thumbnailUrls.map((src, index) => (
          <div
            key={`${src}-${index}`}
            role="listitem"
            className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-white"
          >
            <img
              src={src}
              alt=""
              className="pointer-events-none size-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
