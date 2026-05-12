import { useEffect, type JSX } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from '@/components/ui/card';
import { IMAGES } from '@/constants/images';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAddressesThunk, fetchProfileThunk } from '@/store/thunks';

import { ProfileCoverSummarySection } from './sections/ProfileCoverSummarySection';
import { ProfileDetailsSection } from './sections/ProfileDetailsSection';

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

      <div className="relative mx-auto flex w-full max-w-[1212px] flex-col gap-6 self-stretch">

        <Card className="overflow-hidden rounded-xl bg-gray-white pb-8 pt-0">
          <ProfileCoverSummarySection
            coverSrc={coverSrc}
            avatarSrc={avatarSrc}
            displayName={displayName}
            initials={initials}
          />
          <ProfileDetailsSection
            email={email}
            phone={phone}
            locationDisplay={locationDisplay}
          />
        </Card>
      </div>
    </>
  );
}
