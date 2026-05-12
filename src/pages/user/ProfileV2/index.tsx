import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

import { Card } from '@/components/ui/card';
import { IMAGES } from '@/constants/images';
import {
  addressToFormValues,
  emptyAddressForm,
  toCreatePayload,
  validateAddressForm,
  type AddressFormValues,
} from '@/pages/user/ProfileV2/profileAddressForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createAddressThunk,
  deleteAddressThunk,
  fetchAddressesThunk,
  fetchProfileThunk,
  setDefaultAddressThunk,
  updateAddressThunk,
  updateProfileThunk,
} from '@/store/thunks';
import { isVietnamesePhone } from '@/utils/phone';

import { ProfileCoverSummarySection } from './sections/ProfileCoverSummarySection';
import { ProfileDetailsSection } from './sections/ProfileDetailsSection';

export default function ProfileV2(): JSX.Element {
  const dispatch = useAppDispatch();
  const { profile, addresses } = useAppSelector(s => s.user);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddresses, setEditingAddresses] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ fullName: '', phone: '' });
  const [profilePhoneError, setProfilePhoneError] = useState<string | undefined>();
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');
  const [addressForm, setAddressForm] = useState<AddressFormValues>(emptyAddressForm());
  const [addressFieldErrors, setAddressFieldErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    void dispatch(fetchProfileThunk());
    void dispatch(fetchAddressesThunk());
  }, [dispatch]);

  const defaultAddress = useMemo(
    () => addresses.find(a => a.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const beginEditProfile = useCallback(() => {
    setEditingAddresses(false);
    setEditingProfile(true);
    setProfileDraft({
      fullName: profile?.fullName?.trim() ?? '',
      phone: profile?.phone?.trim() ?? '',
    });
    setProfilePhoneError(undefined);
  }, [profile?.fullName, profile?.phone]);

  const cancelProfileEdit = useCallback(() => {
    setEditingProfile(false);
    setProfilePhoneError(undefined);
  }, []);

  const toggleProfileEdit = useCallback(() => {
    if (editingProfile) {
      cancelProfileEdit();
    } else {
      beginEditProfile();
    }
  }, [beginEditProfile, cancelProfileEdit, editingProfile]);

  const beginEditAddresses = useCallback(() => {
    setEditingProfile(false);
    setEditingAddresses(true);
    setAddressFieldErrors({});
    const firstId = defaultAddress?.id ?? addresses[0]?.id;
    if (!firstId) {
      setSelectedAddressId('new');
      setAddressForm({ ...emptyAddressForm(), isDefault: true });
    } else {
      setSelectedAddressId(firstId);
      const a = addresses.find(x => x.id === firstId);
      setAddressForm(a ? addressToFormValues(a) : emptyAddressForm());
    }
  }, [addresses, defaultAddress?.id]);

  const cancelAddressEdit = useCallback(() => {
    setEditingAddresses(false);
    setAddressFieldErrors({});
  }, []);

  const toggleAddressesEdit = useCallback(() => {
    if (editingAddresses) {
      cancelAddressEdit();
    } else {
      beginEditAddresses();
    }
  }, [beginEditAddresses, cancelAddressEdit, editingAddresses]);

  const handleAddressPickerChange = useCallback(
    (id: string | 'new') => {
      setSelectedAddressId(id);
      setAddressFieldErrors({});
      if (id === 'new') {
        setAddressForm({ ...emptyAddressForm(), isDefault: addresses.length === 0 });
      } else {
        const a = addresses.find(x => x.id === id);
        setAddressForm(a ? addressToFormValues(a) : emptyAddressForm());
      }
    },
    [addresses]
  );

  useEffect(() => {
    if (!editingAddresses) return;
    if (selectedAddressId === 'new') return;
    const exists = addresses.some(a => a.id === selectedAddressId);
    if (!exists) {
      const fallback = addresses.find(a => a.isDefault) ?? addresses[0];
      if (fallback) {
        setSelectedAddressId(fallback.id);
        setAddressForm(addressToFormValues(fallback));
      } else {
        setSelectedAddressId('new');
        setAddressForm({ ...emptyAddressForm(), isDefault: true });
      }
    }
  }, [addresses, editingAddresses, selectedAddressId]);

  const onSaveProfile = async () => {
    if (!profileDraft.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (profileDraft.phone.trim() && !isVietnamesePhone(profileDraft.phone)) {
      setProfilePhoneError('Phone number must be valid Vietnamese phone number');
      return;
    }
    setProfilePhoneError(undefined);
    setSavingProfile(true);
    try {
      await dispatch(
        updateProfileThunk({
          fullName: profileDraft.fullName.trim(),
          phone: profileDraft.phone.trim() || null,
        })
      ).unwrap();
      toast.success('Profile updated');
      setEditingProfile(false);
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const onSaveAddress = async () => {
    const errors = validateAddressForm(addressForm);
    setAddressFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSavingAddress(true);
    try {
      const payload = toCreatePayload(addressForm);
      if (selectedAddressId === 'new') {
        await dispatch(createAddressThunk(payload)).unwrap();
        toast.success('Address created');
      } else {
        await dispatch(updateAddressThunk({ id: selectedAddressId, body: payload })).unwrap();
        toast.success('Address updated');
      }
      setEditingAddresses(false);
    } catch {
      toast.error('Could not save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const onSetDefaultAddress = async (id: string) => {
    setSavingAddress(true);
    try {
      await dispatch(setDefaultAddressThunk(id)).unwrap();
      toast.success('Default address updated');
      if (id === selectedAddressId) {
        setAddressForm(f => ({ ...f, isDefault: true }));
      }
    } catch {
      toast.error('Could not set default');
    } finally {
      setSavingAddress(false);
    }
  };

  const onDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    setSavingAddress(true);
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      toast.success('Address deleted');
    } catch {
      toast.error('Could not delete address');
    } finally {
      setSavingAddress(false);
    }
  };

  const displayName = profile?.fullName?.trim() || 'Vũ Cát Tường';
  const email = profile?.email ?? 'thang2k6adu@gmail.com';
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
          <ProfileDetailsSection
            editingProfile={editingProfile}
            editingAddresses={editingAddresses}
            savingProfile={savingProfile}
            savingAddress={savingAddress}
            profileFullName={
              editingProfile ? profileDraft.fullName : profile?.fullName?.trim() || '—'
            }
            profileEmail={email}
            profilePhone={editingProfile ? profileDraft.phone : profile?.phone?.trim() || '—'}
            onProfileFullNameChange={v => setProfileDraft(d => ({ ...d, fullName: v }))}
            onProfilePhoneChange={v => setProfileDraft(d => ({ ...d, phone: v }))}
            profilePhoneError={profilePhoneError}
            onSaveProfile={() => void onSaveProfile()}
            onCancelProfile={cancelProfileEdit}
            addressReadonly={defaultAddress}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectedAddressIdChange={handleAddressPickerChange}
            addressForm={addressForm}
            onAddressFormChange={patch => setAddressForm(f => ({ ...f, ...patch }))}
            addressFieldErrors={addressFieldErrors}
            onSaveAddress={() => void onSaveAddress()}
            onCancelAddress={cancelAddressEdit}
            onAddNewAddress={() => handleAddressPickerChange('new')}
            onSetDefaultAddress={id => void onSetDefaultAddress(id)}
            onDeleteAddress={id => void onDeleteAddress(id)}
          />
        </Card>
      </div>
    </>
  );
}
