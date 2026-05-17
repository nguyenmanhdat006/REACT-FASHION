import { useRef, type ChangeEvent } from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';

import { IconButton } from '@/components/buttons/IconButton';
import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { LabelButton } from '@/components/buttons/LabelButton';
import Modal from '@/components/overlay/Modal';
import { cn } from '@/lib/utils';

import type { UseAdminProductFormMediaResult } from '../useAdminProductFormMedia';

export type AdminProductGalleryModalProps = {
  media: UseAdminProductFormMediaResult;
  uploadLocked: boolean;
};

export default function AdminProductGalleryModal({
  media,
  uploadLocked,
}: AdminProductGalleryModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const busy = uploadLocked;

  const { productImages, coverIndex, setProductImages, setCoverIndex } = media;

  const onAddFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    e.target.value = '';
    if (!files?.length) return;

    const appended: string[] = [];
    for (const file of Array.from(files)) {
      const url = await media.uploadProductImage(file);
      if (url) appended.push(url);
    }
    if (appended.length) {
      setProductImages(prev => [...prev, ...appended]);
    }
  };

  return (
    <Modal
      isOpen={media.galleryModalOpen}
      onClose={media.onCloseGalleryModal}
      title="Product images"
      size="lg"
      footer={
        <LabelButton label="Done" type="button" onClick={media.onCloseGalleryModal} tone="primary" />
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={onAddFilesChange}
      />
      <div className="flex max-h-[min(70vh,28rem)] flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <IconLabelButton
            type="button"
            icon={Plus}
            label="Add images"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 py-2 px-3"
          />
        </div>
        <ul
          className={cn(
            'grid max-h-[min(60vh,22rem)] auto-rows-fr gap-3 overflow-y-auto pr-1',
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
          )}
        >
          {productImages.length === 0 ? (
            <li className="col-span-full rounded-lg bg-muted/40 px-4 py-10 text-center text-body-regular text-muted-foreground">
              No images yet. Use Add images, the + button on the card, or upload a cover image.
            </li>
          ) : (
            productImages.map((url, index) => {
              const isCover = index === coverIndex;
              return (
                <li
                  key={`${url}-${index}`}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted',
                    isCover && 'border-primary-500 border-2'
                  )}
                >
                  <img src={url} alt="" className="size-full object-cover" />
                  <div className="absolute right-1.5 top-1.5 flex gap-1 rounded-md bg-background/90 p-1">
                    <IconButton
                      type="button"
                      icon={Star}
                      ariaLabel={isCover ? 'Current cover image' : 'Set as cover'}
                      disabled={busy}
                      size="icon-sm"
                      variant="ghost"
                      className="!h-7 !min-h-0 !w-7 !p-0"
                      iconClassName={cn('size-4', isCover ? 'text-primary-600' : 'text-foreground')}
                      onClick={() => setCoverIndex(index)}
                    />
                    <IconButton
                      type="button"
                      icon={Trash2}
                      ariaLabel="Remove image"
                      disabled={busy}
                      size="icon-sm"
                      variant="ghost"
                      className="!h-7 !min-h-0 !w-7 !p-0"
                      iconClassName="size-4 text-destructive"
                      onClick={() => media.removeImageAt(index)}
                    />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </Modal>
  );
}
