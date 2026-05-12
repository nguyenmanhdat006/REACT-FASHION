import { useEffect, useMemo, useState, type JSX } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from '@/components/ui/card';
import { IMAGES } from '@/constants/images';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAddressesThunk, fetchProfileThunk } from '@/store/thunks';

import { ProfileAddressesModal } from './components/ProfileAddressesModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ProfileCoverSummarySection } from './sections/ProfileCoverSummarySection';
import { ProfileDetailsSection } from './sections/ProfileDetailsSection';

export default function ProfileV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const { profile, addresses } = useAppSelector((state) => state.user);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addressesModalOpen, setAddressesModalOpen] = useState(false);

  useEffect(() => {
    void dispatch(fetchProfileThunk());
    void dispatch(fetchAddressesThunk());
  }, [dispatch]);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const locationDisplay = defaultAddress
    ? [
        defaultAddress.addressLine1,
        defaultAddress.city,
        defaultAddress.country ?? 'Vietnam',
      ]
        .filter(Boolean)
        .join(' · ')
    : '—';

  const displayName = profile?.fullName?.trim() || 'Vũ Cát Tường';
  const detailFullName = profile?.fullName?.trim() || '—';
  const email = profile?.email ?? 'thang2k6adu@gmail.com';
  const phone = profile?.phone?.trim() || '0979632788';
  const avatarSrc = profile?.avatarUrl ?? IMAGES.USER_AVATAR;
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
            onEditProfile={() => setProfileModalOpen(true)}
            onEditAddresses={() => setAddressesModalOpen(true)}
          />
          <ProfileDetailsSection
            fullName={detailFullName}
            email={email}
            phone={phone}
            locationDisplay={locationDisplay}
          />
        </Card>
      </div>

      <ProfileEditModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <ProfileAddressesModal
        open={addressesModalOpen}
        onClose={() => setAddressesModalOpen(false)}
      />
    </>
  );
}
