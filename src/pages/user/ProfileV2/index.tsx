import {
  type LucideIcon,
  Camera,
  Mail,
  MapPin,
  Pencil,
  Smartphone,
} from 'lucide-react';
import { useEffect, type JSX } from 'react';
import { Helmet } from 'react-helmet-async';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES } from '@/constants/images';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAddressesThunk,
  fetchProfileThunk,
} from '@/store/thunks';

function ProfileReadOnlyField({
  id,
  label,
  icon: Icon,
  value,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-caption-lg-regular font-normal text-gray-500"
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <Input
          id={id}
          readOnly
          value={value}
          className={cn(
            'h-11 border-0 bg-gray-50 pl-11 text-body-regular text-gray-800',
            'shadow-none focus-visible:ring-0 dark:bg-input/30',
          )}
        />
      </div>
    </div>
  );
}

export default function ProfileV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const { profile, addresses } = useAppSelector((state) => state.user);

  useEffect(() => {
    void dispatch(fetchProfileThunk());
    void dispatch(fetchAddressesThunk());
  }, [dispatch]);

  const defaultAddress =
    addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
  const locationDisplay = defaultAddress
    ? [defaultAddress.city, defaultAddress.country].filter(Boolean).join(', ')
    : 'Ha Noi';

  const displayName = profile?.fullName?.trim() || 'Vũ Cát Tường';
  const email = profile?.email ?? 'thang2k6adu@gmail.com';
  const phone = profile?.phone?.trim() || '0979632788';
  const avatarSrc = profile?.avatar ?? IMAGES.USER_AVATAR;
  const coverSrc = IMAGES.OFFER_BANNER;

  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Helmet>
        <title>Profile - React Fashion</title>
      </Helmet>

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col gap-6 self-stretch">
        <Card className="overflow-hidden rounded-xl border border-gray-100 bg-gray-white shadow-md ring-0">
          <div className="relative aspect-[21/9] min-h-[160px] w-full sm:min-h-[200px]">
            <img
              src={coverSrc}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-black/25 to-transparent" />
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

          <CardContent className="relative px-6 pb-8 pt-0">
            <div className="flex flex-col gap-6 border-b border-gray-100 pb-8 pt-0 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-6">
                <Avatar className="size-28 shrink-0 border-4 border-gray-white shadow-md sm:size-32">
                  <AvatarImage src={avatarSrc} alt="" />
                  <AvatarFallback className="bg-primary-700 text-h5-semi text-primary-900">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-h4-semi text-gray-black sm:pb-1">
                  {displayName}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 gap-2 border-gray-200 bg-gray-white px-4 text-body-regular text-gray-black hover:bg-gray-50"
              >
                <Pencil className="size-4" aria-hidden />
                Edit profile
              </Button>
            </div>

            <div className="grid gap-6 pt-8 sm:grid-cols-2">
              <ProfileReadOnlyField
                id="profile-email"
                label="Email address"
                icon={Mail}
                value={email}
              />
              <ProfileReadOnlyField
                id="profile-phone"
                label="Phone Number"
                icon={Smartphone}
                value={phone}
              />
              <ProfileReadOnlyField
                id="profile-country"
                label="Country"
                icon={MapPin}
                value={locationDisplay}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
