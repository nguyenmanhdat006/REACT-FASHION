import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { COVER_IMAGE, GALLERY_IMAGES } from '../constants';

export default function AdminAddProductMediaSection() {
  return (
    <Card className="flex flex-1 gap-0 self-stretch overflow-hidden rounded-2xl bg-white py-0 dark:bg-gray-800">
      <CardContent className="p-5 flex-1">
        <div className="flex h-full flex-col gap-4 sm:flex-row">
          <div className="relative aspect-square h-full w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:max-w-[48%]">
            <img src={COVER_IMAGE} alt="" className="size-full object-cover border border-gray-200 rounded-2xl" />
            <Badge className="absolute left-3 top-3 rounded-md bg-white border-[0.5px] border-gray-200 text-black text-caption-lg-regular">
              Cover
            </Badge>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            {GALLERY_IMAGES.map((src, index) => (
              <div
                key={`gallery-slot-${index}`}
                className="aspect-square overflow-hidden rounded-xl bg-muted border border-gray-200 size-full"
              >
                <img src={src} alt="" className="size-full object-cover" />
              </div>
            ))}
            <button
              type="button"
              className={cn(
                'flex size-full aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary-500 bg-primary/5 transition-colors hover:bg-primary/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Add gallery image"
            >
              <Plus className="size-8 text-primary-500" strokeWidth={1} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
