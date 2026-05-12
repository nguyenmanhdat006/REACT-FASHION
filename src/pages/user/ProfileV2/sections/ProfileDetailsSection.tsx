import { Mail, MapPin, Smartphone, User } from 'lucide-react';
import type { JSX } from 'react';

import { LabeledInputField } from '@/components/form/LabeledInputField';
import type { AddressFormValues } from '@/pages/user/ProfileV2/profileAddressForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Address, AddressType } from '@/types/auth/auth';

export type ProfileDetailsSectionProps = {
  editingProfile: boolean;
  editingAddresses: boolean;
  savingProfile: boolean;
  savingAddress: boolean;

  profileFullName: string;
  profileEmail: string;
  profilePhone: string;
  onProfileFullNameChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
  profilePhoneError?: string;
  onSaveProfile: () => void;
  onCancelProfile: () => void;

  /** Default (or primary) address shown when not editing addresses. */
  addressReadonly: Address | null;
  addresses: Address[];
  selectedAddressId: string | 'new';
  onSelectedAddressIdChange: (id: string | 'new') => void;
  addressForm: AddressFormValues;
  onAddressFormChange: (patch: Partial<AddressFormValues>) => void;
  addressFieldErrors: Record<string, string>;
  onSaveAddress: () => void;
  onCancelAddress: () => void;
  onAddNewAddress: () => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
};

const dash = (v: string | null | undefined) => (v && String(v).trim() !== '' ? v : '—');

export function ProfileDetailsSection({
  editingProfile,
  editingAddresses,
  savingProfile,
  savingAddress,
  profileFullName,
  profileEmail,
  profilePhone,
  onProfileFullNameChange,
  onProfilePhoneChange,
  profilePhoneError,
  onSaveProfile,
  onCancelProfile,
  addressReadonly,
  addresses,
  selectedAddressId,
  onSelectedAddressIdChange,
  addressForm,
  onAddressFormChange,
  addressFieldErrors,
  onSaveAddress,
  onCancelAddress,
  onAddNewAddress,
  onSetDefaultAddress,
  onDeleteAddress,
}: ProfileDetailsSectionProps): JSX.Element {
  const ro = addressReadonly;

  return (
    <div className="flex flex-col gap-10 px-8 pb-2">
      <section aria-label="Account" className="flex flex-col gap-4">
        <h2 className="text-h6-semi text-gray-black dark:text-gray-white">Account</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <LabeledInputField
            mode={editingProfile ? 'edit' : 'readonly'}
            id="profile-fullName"
            label="Full name"
            icon={User}
            value={profileFullName}
            onChange={e => onProfileFullNameChange(e.target.value)}
          />
          <LabeledInputField
            mode="readonly"
            id="profile-email"
            label="Email address"
            icon={Mail}
            value={profileEmail}
          />
          <LabeledInputField
            mode={editingProfile ? 'edit' : 'readonly'}
            id="profile-phone"
            label="Phone number"
            icon={Smartphone}
            value={profilePhone}
            onChange={e => onProfilePhoneChange(e.target.value)}
            error={profilePhoneError}
          />
        </div>
        {editingProfile ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={onSaveProfile} disabled={savingProfile}>
              Save profile
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onCancelProfile}
              disabled={savingProfile}
            >
              Cancel
            </Button>
          </div>
        ) : null}
      </section>

      <section aria-label="Shipping addresses" className="flex flex-col gap-4 border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-h6-semi text-gray-black dark:text-gray-white">Shipping address</h2>
        </div>

        {editingAddresses && addresses.length > 1 ? (
          <div className="flex max-w-md flex-col gap-2">
            <Label htmlFor="profile-address-picker" className="text-caption-lg-regular text-gray-500">
              Editing address
            </Label>
            <select
              id="profile-address-picker"
              className="h-11 rounded-md border border-input bg-gray-50 px-3 text-body-regular text-gray-800 dark:bg-input/30"
              value={selectedAddressId}
              onChange={e => {
                const v = e.target.value;
                onSelectedAddressIdChange(v === 'new' ? 'new' : v);
              }}
            >
              {addresses.map(a => (
                <option key={a.id} value={a.id}>
                  {a.fullName} — {a.addressLine1.slice(0, 40)}
                  {a.isDefault ? ' (default)' : ''}
                </option>
              ))}
              <option value="new">+ Add new address</option>
            </select>
          </div>
        ) : null}

        {editingAddresses && addresses.length <= 1 ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={onAddNewAddress}>
              Add new address
            </Button>
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2">
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-fullName"
            label="Recipient full name"
            icon={User}
            value={editingAddresses ? addressForm.fullName : dash(ro?.fullName)}
            onChange={e => onAddressFormChange({ fullName: e.target.value })}
            error={addressFieldErrors.fullName}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-phone"
            label="Phone"
            value={editingAddresses ? addressForm.phone : dash(ro?.phone)}
            onChange={e => onAddressFormChange({ phone: e.target.value })}
            error={addressFieldErrors.phone}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-line1"
            label="Address line 1"
            icon={MapPin}
            className="sm:col-span-2"
            value={editingAddresses ? addressForm.addressLine1 : dash(ro?.addressLine1)}
            onChange={e => onAddressFormChange({ addressLine1: e.target.value })}
            error={addressFieldErrors.addressLine1}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-line2"
            label="Address line 2"
            className="sm:col-span-2"
            value={editingAddresses ? (addressForm.addressLine2 ?? '') : dash(ro?.addressLine2)}
            onChange={e => onAddressFormChange({ addressLine2: e.target.value })}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-city"
            label="City"
            value={editingAddresses ? addressForm.city : dash(ro?.city)}
            onChange={e => onAddressFormChange({ city: e.target.value })}
            error={addressFieldErrors.city}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-district"
            label="District"
            value={editingAddresses ? (addressForm.district ?? '') : dash(ro?.district)}
            onChange={e => onAddressFormChange({ district: e.target.value })}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-ward"
            label="Ward"
            value={editingAddresses ? (addressForm.ward ?? '') : dash(ro?.ward)}
            onChange={e => onAddressFormChange({ ward: e.target.value })}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-postal"
            label="Postal code"
            value={editingAddresses ? (addressForm.postalCode ?? '') : dash(ro?.postalCode)}
            onChange={e => onAddressFormChange({ postalCode: e.target.value })}
          />
          <LabeledInputField
            mode={editingAddresses ? 'edit' : 'readonly'}
            id="addr-country"
            label="Country"
            value={editingAddresses ? (addressForm.country ?? '') : dash(ro?.country)}
            onChange={e => onAddressFormChange({ country: e.target.value })}
          />
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="addr-type" className="text-caption-lg-regular text-gray-500">
              Address type
            </Label>
            {editingAddresses ? (
              <select
                id="addr-type"
                className="h-11 rounded-md border border-input bg-gray-50 px-3 text-body-regular text-gray-800 dark:bg-input/30"
                value={addressForm.addressType ?? 'SHIPPING'}
                onChange={e =>
                  onAddressFormChange({
                    addressType: e.target.value as AddressType,
                  })
                }
              >
                <option value="SHIPPING">SHIPPING</option>
                <option value="BILLING">BILLING</option>
                <option value="BOTH">BOTH</option>
              </select>
            ) : (
              <p className="text-body-regular text-gray-800 dark:text-gray-200">
                {dash(ro?.addressType ?? 'SHIPPING')}
              </p>
            )}
          </div>
          {editingAddresses ? (
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="addr-default"
                checked={Boolean(addressForm.isDefault)}
                onCheckedChange={v => onAddressFormChange({ isDefault: v === true })}
              />
              <Label htmlFor="addr-default" className="text-body-regular font-normal">
                Default shipping address
              </Label>
            </div>
          ) : (
            <p className="text-caption-lg-regular text-gray-500 sm:col-span-2">
              {ro?.isDefault ? 'This is your default shipping address.' : 'Not set as default.'}
            </p>
          )}
        </div>

        {editingAddresses ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={onSaveAddress} disabled={savingAddress}>
              Save address
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onCancelAddress} disabled={savingAddress}>
              Cancel
            </Button>
            {selectedAddressId !== 'new' && !addressForm.isDefault ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={savingAddress}
                onClick={() => onSetDefaultAddress(selectedAddressId)}
              >
                Set as default only
              </Button>
            ) : null}
            {selectedAddressId !== 'new' ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={savingAddress}
                onClick={() => onDeleteAddress(selectedAddressId)}
              >
                Delete address
              </Button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
