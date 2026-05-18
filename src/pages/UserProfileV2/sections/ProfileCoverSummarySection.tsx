import { Camera, MapPin, Pencil, UserRound } from 'lucide-react';
import type { ChangeEvent, JSX, RefObject } from 'react';

import { IconLabelButton } from '@/components/buttons/IconLabelButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ProfileCoverSummarySectionProps = {
  avatarUrl?: string | null;
  displayName: string;
  initials: string;
  profileEditing: boolean;
  addressesEditing: boolean;
  onToggleProfileEdit: () => void;
  onToggleAddressesEdit: () => void;
  avatarFileInputRef: RefObject<HTMLInputElement>;
  avatarAccept: string;
  avatarUploadBusy?: boolean;
  onAvatarUploadClick: () => void;
  onAvatarFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/** Kéo block info lên chồng bìa (avatar cắm vào cover). */
const COVER_OVERLAP_CLASS = '-mt-10';

function ProfileCoverPlaceholder(): JSX.Element {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-100 via-gray-50 to-primary-200/70"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.85)_0%,transparent_45%),radial-gradient(circle_at_85%_70%,rgba(0,0,0,0.06)_0%,transparent_50%)]"
        aria-hidden
      />
    </>
  );
}

export function ProfileCoverSummarySection({
  avatarUrl,
  displayName,
  initials,
  profileEditing,
  addressesEditing,
  onToggleProfileEdit,
  onToggleAddressesEdit,
  avatarFileInputRef,
  avatarAccept,
  avatarUploadBusy = false,
  onAvatarUploadClick,
  onAvatarFileChange,
}: ProfileCoverSummarySectionProps): JSX.Element {
  const hasAvatarPhoto = Boolean(avatarUrl?.trim());

  return (
    <section
      aria-label="Cover and account summary"
      className="flex flex-col"
    >
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden">
        <ProfileCoverPlaceholder />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-black/25 to-transparent" />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute bottom-3 right-3 size-10 rounded-full bg-gray-white/90 text-gray-black hover:bg-gray-white"
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
          <div className="relative shrink-0">
            <input
              ref={avatarFileInputRef}
              type="file"
              accept={avatarAccept}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={onAvatarFileChange}
            />
            <Avatar
              className={cn(
                'size-24 border-2 border-gray-white sm:size-28 md:size-32',
                avatarUploadBusy && 'opacity-70',
              )}
            >
              {hasAvatarPhoto ? (
                <AvatarImage src={avatarUrl!} alt="" />
              ) : null}
              <AvatarFallback className="bg-gray-100 text-h5-semi uppercase text-gray-700">
                {initials ? (
                  initials
                ) : (
                  <UserRound className="size-8 text-gray-500 sm:size-9" strokeWidth={1.75} />
                )}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              disabled={avatarUploadBusy}
              className="absolute bottom-0 right-0 size-9 rounded-full border-2 border-gray-white bg-gray-white/95 text-gray-black hover:bg-gray-white sm:size-10"
              aria-label="Upload profile photo"
              onClick={onAvatarUploadClick}
            >
              <Camera className="size-4 sm:size-5" aria-hidden />
            </Button>
          </div>
          <p className="min-w-0 truncate text-h4-semi text-gray-black">
            {displayName}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <IconLabelButton
            icon={Pencil}
            label={profileEditing ? 'Cancel' : 'Edit profile'}
            variant="outline"
            pillVariant={profileEditing ? 'selected' : 'default'}
            size="default"
            className="rounded-lg px-2 py-1"
            iconClassName="size-4"
            labelClassName="text-body-regular text-gray-black"
            onClick={onToggleProfileEdit}
          />
          <IconLabelButton
            icon={MapPin}
            label={addressesEditing ? 'Cancel' : 'Edit addresses'}
            variant="outline"
            pillVariant={addressesEditing ? 'selected' : 'default'}
            size="default"
            className="rounded-lg px-2 py-1"
            iconClassName="size-4"
            labelClassName="text-body-regular text-gray-black"
            onClick={onToggleAddressesEdit}
          />
        </div>
      </div>
    </section>
  );
}
