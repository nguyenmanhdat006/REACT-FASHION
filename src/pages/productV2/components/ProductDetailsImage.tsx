import { useCallback, useRef, type JSX, type PointerEvent } from "react";

import { IMAGES } from "@/constants/images";
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
  const stripRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
  } | null>(null);

  const endDrag = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    const drag = dragRef.current;
    if (!el || !drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    try {
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* releasePointerCapture can throw if already released */
    }
  }, []);

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = stripRef.current;
    if (!el) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    const drag = dragRef.current;
    if (!el || !drag || drag.pointerId !== e.pointerId) return;
    el.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
  }, []);

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col justify-end self-stretch overflow-hidden rounded-2xl bg-cover bg-top p-4"
      )}
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      aria-label="Supper Skinny jogger in brown — product gallery"
    >
      <div
        ref={stripRef}
        className={cn(
          "flex w-full min-w-0 cursor-grab gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide active:cursor-grabbing",
          "touch-pan-x select-none"
        )}
        role="list"
        aria-label="Product image thumbnails, drag horizontally to scroll"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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
