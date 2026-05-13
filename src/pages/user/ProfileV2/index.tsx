import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

import { Card } from '@/components/ui/card';
import { IMAGES } from '@/constants/images';
import { useProfile } from '@/hooks/user/useProfile';
import {
  addressSchema,
  addressToFormValues,
  emptyAddressForm,
  emptyProfileAccount,
  profileAccountSchema,
  profileToFormValues,
  toCreatePayload,
  toUpdateProfilePayload,
  type AddressFormValues,
  type ProfileAccountFormValues,
} from '@/pages/user/ProfileV2/profileForm';
import { useAppSelector } from '@/store/hooks';
import { dash } from '@/utils/formDisplay';

import { ProfileAddressSection } from './sections/ProfileAddressSection';
import { ProfileCoverSummarySection } from './sections/ProfileCoverSummarySection';
import { ProfileSection } from './sections/ProfileSection';

export default function ProfileV2(): JSX.Element {
  const {
    fetchProfile,
    fetchAddresses,
    updateProfile,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
  } = useProfile();
  const { profile, addresses } = useAppSelector(s => s.user);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddresses, setEditingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');

  const profileForm = useForm<ProfileAccountFormValues>({
    resolver: zodResolver(profileAccountSchema),
    defaultValues: emptyProfileAccount(),
    mode: 'onSubmit',
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyAddressForm(),
    mode: 'onSubmit',
  });

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    void fetchAddresses();
  }, [fetchAddresses]);

  const defaultAddress = useMemo(
    () => addresses.find(a => a.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const beginEditProfile = useCallback(() => {
    setEditingAddresses(false);
    setEditingProfile(true);
    profileForm.reset(profileToFormValues(profile));
  }, [profile, profileForm]);

  const cancelProfileEdit = useCallback(() => {
    setEditingProfile(false);
    profileForm.reset(profileToFormValues(profile));
  }, [profile, profileForm]);

  const toggleProfileEdit = useCallback(() => {
    if (editingProfile) cancelProfileEdit();
    else beginEditProfile();
  }, [beginEditProfile, cancelProfileEdit, editingProfile]);

  const beginEditAddresses = useCallback(() => {
    setEditingProfile(false);
    setEditingAddresses(true);
    const firstId = defaultAddress?.id ?? addresses[0]?.id;
    if (!firstId) {
      setSelectedAddressId('new');
      addressForm.reset({ ...emptyAddressForm(), isDefault: true });
    } else {
      setSelectedAddressId(firstId);
      const a = addresses.find(x => x.id === firstId);
      addressForm.reset(a ? addressToFormValues(a) : emptyAddressForm());
    }
  }, [addresses, addressForm, defaultAddress?.id]);

  const cancelAddressEdit = useCallback(() => {
    setEditingAddresses(false);
  }, []);

  const toggleAddressesEdit = useCallback(() => {
    if (editingAddresses) cancelAddressEdit();
    else beginEditAddresses();
  }, [beginEditAddresses, cancelAddressEdit, editingAddresses]);

  const handleAddressPickerChange = useCallback(
    (id: string | 'new') => {
      setSelectedAddressId(id);
      if (id === 'new') {
        addressForm.reset({
          ...emptyAddressForm(),
          isDefault: addresses.length === 0,
        });
      } else {
        const a = addresses.find(x => x.id === id);
        addressForm.reset(a ? addressToFormValues(a) : emptyAddressForm());
      }
    },
    [addresses, addressForm]
  );

  useEffect(() => {
    if (!editingAddresses) return;
    if (selectedAddressId === 'new') return;
    const exists = addresses.some(a => a.id === selectedAddressId);
    if (!exists) {
      const fallback = addresses.find(a => a.isDefault) ?? addresses[0];
      if (fallback) {
        setSelectedAddressId(fallback.id);
        addressForm.reset(addressToFormValues(fallback));
      } else {
        setSelectedAddressId('new');
        addressForm.reset({ ...emptyAddressForm(), isDefault: true });
      }
    }
  }, [addresses, addressForm, editingAddresses, selectedAddressId]);

  const onValidProfile = async (values: ProfileAccountFormValues) => {
    const ok = await updateProfile(toUpdateProfilePayload(values));
    if (ok) setEditingProfile(false);
  };

  const onValidAddress = async (values: AddressFormValues) => {
    const payload = toCreatePayload(values);
    const ok =
      selectedAddressId === 'new'
        ? await createAddress(payload)
        : await updateAddress(selectedAddressId, payload);
    if (ok) setEditingAddresses(false);
  };

  const submitProfile = profileForm.handleSubmit(onValidProfile);
  const submitAddress = addressForm.handleSubmit(onValidAddress);

  const onSetDefaultAddress = async (id: string) => {
    const ok = await setDefaultAddress(id);
    if (ok && id === selectedAddressId) {
      addressForm.setValue('isDefault', true, { shouldDirty: true });
    }
  };

  const onDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    void deleteAddress(id);
  };

  const displayName = profile?.fullName?.trim() || 'Vũ Cát Tường';
  const avatarSrc = profile?.avatarUrl ?? IMAGES.USER_AVATAR;
  const coverSrc = IMAGES.OFFER_BANNER;

  const initials = displayName
    .split(/\s+/)
    .map(w => w[0])
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
            profileEditing={editingProfile}
            addressesEditing={editingAddresses}
            onToggleProfileEdit={toggleProfileEdit}
            onToggleAddressesEdit={toggleAddressesEdit}
          />
          <div className="flex flex-col gap-10 px-8 pb-2">
            <ProfileSection
              editingProfile={editingProfile}
              profileForm={profileForm}
              onSubmitProfile={() => void submitProfile()}
              onCancelProfile={cancelProfileEdit}
              profileReadonly={{
                fullName: dash(profile?.fullName),
                email: dash(profile?.email),
                phone: dash(profile?.phone),
              }}
            />
            <ProfileAddressSection
              editingAddresses={editingAddresses}
              addressForm={addressForm}
              onSubmitAddress={() => void submitAddress()}
              onCancelAddress={cancelAddressEdit}
              addressReadonly={defaultAddress}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectedAddressIdChange={handleAddressPickerChange}
              onAddNewAddress={() => handleAddressPickerChange('new')}
              onSetDefaultAddress={id => void onSetDefaultAddress(id)}
              onDeleteAddress={id => void onDeleteAddress(id)}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
