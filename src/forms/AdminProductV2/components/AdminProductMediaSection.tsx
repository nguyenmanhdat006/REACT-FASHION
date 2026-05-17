import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { UseAdminProductFormMediaResult } from '../hooks/useAdminProductFormMedia';

export type AdminProductMediaSectionProps = {
  media: UseAdminProductFormMediaResult;
  readOnly?: boolean;
  uploadLocked: boolean;
};

const galleryPreviewButtonClass = cn(
  'relative aspect-square size-full overflow-hidden rounded-xl border border-gray-200 bg-muted transition-colors',
  'hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
);

export default function AdminProductMediaSection({
  media,
  readOnly = false,
  uploadLocked,
}: AdminProductMediaSectionProps) {
  const { coverUrl, galleryPreviews } = media;
  const { slot0, slot1, slot2, moreCount } = galleryPreviews;

  const openGallery = () => {
    if (readOnly || uploadLocked) return;
    media.onGalleryPreviewClick();
  };

  return (
    <Card className="flex max-h-[360px] flex-1 gap-0 self-stretch overflow-hidden rounded-2xl bg-white py-0 dark:bg-gray-800">
      <CardContent className="flex-1 p-5">
        <div className="flex h-full flex-col gap-4 sm:flex-row">
          <div
            className={cn(
              'relative aspect-square h-full w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:max-w-[48%]',
              readOnly && 'pointer-events-none'
            )}
            onClick={readOnly ? undefined : media.onCoverClick}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="size-full rounded-2xl border border-gray-200 object-cover"
              />
            ) : (
              <div
                className="flex size-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-muted px-3"
                aria-label="Add cover image"
              >
                <Plus className="size-8 text-primary-500" strokeWidth={1} aria-hidden />
              </div>
            )}
            <Badge className="absolute left-3 top-3 rounded-md border-[0.5px] border-gray-200 bg-white text-black text-caption-lg-regular">
              Cover
            </Badge>
          </div>

          <div
            className={cn('grid flex-1 grid-cols-2 gap-4', readOnly && 'pointer-events-none')}
          >
            <button
              type="button"
              className={galleryPreviewButtonClass}
              aria-label={slot0 ? 'Manage gallery images' : 'Open gallery to add images'}
              onClick={openGallery}
            >
              {slot0 ? (
                <img src={slot0} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center px-2 text-center text-body-regular text-muted-foreground">
                  Gallery image 1
                </div>
              )}
            </button>
            <button
              type="button"
              className={galleryPreviewButtonClass}
              aria-label={slot1 ? 'Manage gallery images' : 'Open gallery to add images'}
              onClick={openGallery}
            >
              {slot1 ? (
                <img src={slot1} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center px-2 text-center text-body-regular text-muted-foreground">
                  Gallery image 2
                </div>
              )}
            </button>
            <button
              type="button"
              className={galleryPreviewButtonClass}
              aria-label={
                slot2
                  ? moreCount > 0
                    ? `View gallery, ${moreCount} more images`
                    : 'Manage gallery images'
                  : 'Open gallery to add images'
              }
              onClick={openGallery}
            >
              {slot2 ? (
                <>
                  <img src={slot2} alt="" className="size-full object-cover" />
                  {moreCount > 0 ? (
                    <Badge className="pointer-events-none absolute bottom-2 right-2 rounded-md border-0 bg-black/70 px-2 py-0.5 text-caption-lg-medium text-white tabular-nums dark:bg-black/80">
                      +{moreCount}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <div className="flex size-full items-center justify-center px-2 text-center text-body-regular text-muted-foreground">
                  Gallery image 3
                </div>
              )}
            </button>
            <button
              type="button"
              className={cn(
                'flex size-full aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary-500 bg-primary/5 transition-colors hover:bg-primary/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Add gallery image"
              onClick={() => {
                if (readOnly || uploadLocked) return;
                media.onDashedPlusClick();
              }}
            >
              <Plus className="size-8 text-primary-500" strokeWidth={1} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
