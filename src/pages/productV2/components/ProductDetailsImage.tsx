import { type JSX } from "react";

import { IMAGES } from "@/constants/images";
import { useHorizontalDragScroll } from "@/hooks/useHorizontalDragScroll";
import { cn } from "@/lib/utils";

const HERO_IMAGE = IMAGES.PRODUCT_DEMO_1;

const THUMB_IMAGES = [
  IMAGES.PRODUCT_DEMO_1,
  IMAGES.PRODUCT_DEMO_2,
  IMAGES.PROMO_TILE,
  IMAGES.PRODUCT_DEMO_1,
  IMAGES.PRODUCT_DEMO_2,
  IMAGES.PROMO_TILE,
] as const;

export function ProductDetailsImage(): JSX.Element {
  const stripDrag = useHorizontalDragScroll<HTMLDivElement>();

  return (
    <div
      className={cn(
        "flex min-w-0 border border-gray-200 flex-1 flex-col justify-end self-stretch overflow-hidden rounded-2xl bg-cover bg-top p-4"
      )}
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      aria-label="Supper Skinny jogger in brown — product gallery"
    >
      <div
        ref={stripDrag.ref}
        className={cn(
          "flex w-full min-w-0 cursor-grab gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide active:cursor-grabbing",
          "touch-pan-x select-none"
        )}
        role="list"
        aria-label="Product image thumbnails, drag horizontally to scroll"
        onPointerDown={stripDrag.onPointerDown}
        onPointerMove={stripDrag.onPointerMove}
        onPointerUp={stripDrag.onPointerUp}
        onPointerCancel={stripDrag.onPointerCancel}
      >
        {THUMB_IMAGES.map((src, index) => (
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
