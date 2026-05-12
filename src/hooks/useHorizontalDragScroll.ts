import { useCallback, useRef, type PointerEvent, type RefObject } from 'react';

type DragState = {
  pointerId: number;
  startX: number;
  startScroll: number;
} | null;

export type UseHorizontalDragScrollOptions = {

  ignoreDragFromSelector?: string;
};

export type HorizontalDragScrollProps<T extends HTMLElement> = {
  ref: RefObject<T>;
  onPointerDown: (e: PointerEvent<T>) => void;
  onPointerMove: (e: PointerEvent<T>) => void;
  onPointerUp: (e: PointerEvent<T>) => void;
  onPointerCancel: (e: PointerEvent<T>) => void;
};

export function useHorizontalDragScroll<
  T extends HTMLElement = HTMLDivElement,
>(
  options?: UseHorizontalDragScrollOptions
): HorizontalDragScrollProps<T> {
  const { ignoreDragFromSelector } = options ?? {};
  const ref = useRef<T | null>(null);
  const dragRef = useRef<DragState>(null);

  const endDrag = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    const drag = dragRef.current;
    if (!el || !drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    try {
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* releasePointerCapture có thể throw nếu đã release */
    }
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<T>) => {
      if (e.button !== 0) return;
      if (ignoreDragFromSelector) {
        const target = e.target as HTMLElement;
        if (target.closest(ignoreDragFromSelector)) return;
      }
      const el = ref.current;
      if (!el) return;
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: el.scrollLeft,
      };
      el.setPointerCapture(e.pointerId);
    },
    [ignoreDragFromSelector]
  );

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const el = ref.current;
    const drag = dragRef.current;
    if (!el || !drag || drag.pointerId !== e.pointerId) return;
    el.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
  }, []);

  return {
    ref: ref as RefObject<T>,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}
