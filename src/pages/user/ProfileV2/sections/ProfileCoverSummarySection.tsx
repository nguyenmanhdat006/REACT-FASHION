import { Camera, MapPin, Pencil } from 'lucide-react';
import type { JSX } from 'react';

import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ProfileCoverSummarySectionProps = {
  coverSrc: string;
  avatarSrc: string;
  displayName: string;
  initials: string;
  onEditProfile: () => void;
  onEditAddresses: () => void;
};

/** Kéo block info lên chồng bìa (avatar cắm vào cover). */
const COVER_OVERLAP_CLASS = '-mt-10';

export function ProfileCoverSummarySection({
  coverSrc,
  avatarSrc,
  displayName,
  initials,
  onEditProfile,
  onEditAddresses,
}: ProfileCoverSummarySectionProps): JSX.Element {
  return (
    <section
      aria-label="Cover and account summary"
      className="flex flex-col"
    >
      <div className="relative h-[200px] w-full shrink-0">
        <img
          src={coverSrc}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-black/30 to-transparent" />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute bottom-3 right-3 size-10 rounded-full bg-gray-white/90 text-gray-black shadow-md hover:bg-gray-white"
          aria-label="Change cover photo"
        >
          <Camera className="size-5" aria-hidden />
        </Button>
      </div>

      <div
        className={cn(
          'relative z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-4 px-6 pb-6',
          COVER_OVERLAP_CLASS,
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-24 shrink-0 border-2 border-gray-white sm:size-28 md:size-32">
            <AvatarImage src={avatarSrc} alt="" />
            <AvatarFallback className="bg-primary-700 text-h5-semi text-primary-900">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="min-w-0 truncate text-h4-semi text-gray-black">
            {displayName}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <IconLabelButton
            icon={Pencil}
            label="Edit profile"
            variant="outline"
            pillVariant="default"
            size="default"
            className="rounded-lg px-2 py-1"
            iconClassName="size-4"
            labelClassName="text-body-regular text-gray-black"
            onClick={onEditProfile}
          />
          <IconLabelButton
            icon={MapPin}
            label="Edit addresses"
            variant="outline"
            pillVariant="default"
            size="default"
            className="rounded-lg px-2 py-1"
            iconClassName="size-4"
            labelClassName="text-body-regular text-gray-black"
            onClick={onEditAddresses}
          />
        </div>
      </div>
    </section>
  );
}
