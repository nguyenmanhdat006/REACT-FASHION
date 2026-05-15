import { useRef, type ChangeEvent } from 'react';
import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SLOT_COUNT = 4;
const GALLERY_SLOT_COUNT = 3;

export type AdminAddProductMediaSectionProps = {
  slotUrls: readonly (string | null)[];
  coverSlotIndex: number;
  uploadingSlotIndex: number | null;
  onFileForSlot: (slotIndex: number, file: File) => void;
  onSetCoverSlot: (slotIndex: number) => void;
};

export default function AdminAddProductMediaSection({
  slotUrls,
  coverSlotIndex,
  uploadingSlotIndex,
  onFileForSlot,
  onSetCoverSlot,
}: AdminAddProductMediaSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef(0);

  const safeCover = Math.min(Math.max(coverSlotIndex, 0), SLOT_COUNT - 1);
  const coverUrl = slotUrls[safeCover];

  const triggerPick = (slotIndex: number) => {
    if (uploadingSlotIndex !== null) return;
    pendingSlotRef.current = slotIndex;
    inputRef.current?.click();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slot = pendingSlotRef.current;
    e.target.value = '';
    if (file) onFileForSlot(slot, file);
  };

  const plusTargetSlot = (): number => {
    for (let s = 1; s <= 3; s += 1) {
      if (!slotUrls[s]) return s;
    }
    return 3;
  };

  return (
    <Card className="flex gap-0 flex-1 max-h-[360px] self-stretch overflow-hidden rounded-2xl bg-white py-0 dark:bg-gray-800">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onInputChange}
      />
      <CardContent className="p-5 flex-1">
        <div className="flex h-full flex-col gap-4 sm:flex-row">
          <div
            className="relative aspect-square h-full w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:max-w-[48%]"
            onClick={e => {
              if (uploadingSlotIndex !== null) return;
              if (e.shiftKey) {
                onSetCoverSlot(0);
                return;
              }
              triggerPick(safeCover);
            }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="size-full object-cover border border-gray-200 rounded-2xl"
              />
            ) : (
              <div
                className="flex size-full flex-col items-center justify-center border border-gray-200 rounded-2xl bg-muted px-3"
                aria-label="Add cover image"
              >
                <Plus className="size-8 text-primary-500" strokeWidth={1} aria-hidden />
              </div>
            )}
            <Badge className="absolute left-3 top-3 rounded-md bg-white border-[0.5px] border-gray-200 text-black text-caption-lg-regular">
              Cover
            </Badge>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            {Array.from({ length: GALLERY_SLOT_COUNT }, (_, index) => {
              const slotIndex = index + 1;
              const galleryUrl = slotUrls[slotIndex];
              return (
                <div
                  key={`gallery-slot-${index}`}
                  className="aspect-square overflow-hidden rounded-xl bg-muted border border-gray-200 size-full"
                  onClick={e => {
                    if (uploadingSlotIndex !== null) return;
                    if (e.shiftKey) {
                      onSetCoverSlot(slotIndex);
                      return;
                    }
                    triggerPick(slotIndex);
                  }}
                >
                  {galleryUrl ? (
                    <img src={galleryUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center px-2 text-center text-body-regular text-muted-foreground">
                      Gallery image {index + 1}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              className={cn(
                'flex size-full aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary-500 bg-primary/5 transition-colors hover:bg-primary/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Add gallery image"
              onClick={() => triggerPick(plusTargetSlot())}
            >
              <Plus className="size-8 text-primary-500" strokeWidth={1} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
