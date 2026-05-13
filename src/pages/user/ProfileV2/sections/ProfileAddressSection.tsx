import { MapPin, User } from 'lucide-react';
import type { JSX } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { LabeledInputField } from '@/components/form/LabeledInputField';
import type { AddressFormValues } from '@/pages/user/ProfileV2/profileForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Address, AddressType } from '@/types/auth/auth';
import { dash } from '@/utils/formDisplay';

export type ProfileAddressSectionProps = {
  editingAddresses: boolean;
  addressForm: UseFormReturn<AddressFormValues>;
  onSubmitAddress: () => void;
  onCancelAddress: () => void;
  addressReadonly: Address | null;
  addresses: Address[];
  selectedAddressId: string | 'new';
  onSelectedAddressIdChange: (id: string | 'new') => void;
  onAddNewAddress: () => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
};

export function ProfileAddressSection({
  editingAddresses,
  addressForm,
  onSubmitAddress,
  onCancelAddress,
  addressReadonly,
  addresses,
  selectedAddressId,
  onSelectedAddressIdChange,
  onAddNewAddress,
  onSetDefaultAddress,
  onDeleteAddress,
}: ProfileAddressSectionProps): JSX.Element {
  const ro = addressReadonly;
  const {
    control: addressControl,
    watch: watchAddress,
    setValue: setAddressValue,
    formState: { isSubmitting: savingAddress },
  } = addressForm;
  const addressIsDefault = watchAddress('isDefault');
  const addressType = watchAddress('addressType');

  return (
    <section
      aria-label="Shipping addresses"
      className="flex flex-col gap-4 border-t border-border pt-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-h6-semi text-gray-black dark:text-gray-white">
          Shipping address
        </h2>
      </div>

      {editingAddresses && addresses.length > 1 ? (
        <div className="flex max-w-md flex-col gap-2">
          <Label
            htmlFor="profile-address-picker"
            className="text-caption-lg-regular text-gray-500"
          >
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
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddNewAddress}
          >
            Add new address
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        {editingAddresses ? (
          <>
            <Controller
              control={addressControl}
              name="fullName"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-fullName"
                  label="Recipient full name"
                  icon={User}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="phone"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-phone"
                  label="Phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="addressLine1"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-line1"
                  label="Address line 1"
                  icon={MapPin}
                  className="sm:col-span-2"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="addressLine2"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-line2"
                  label="Address line 2"
                  className="sm:col-span-2"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="city"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-city"
                  label="City"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="district"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-district"
                  label="District"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="ward"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-ward"
                  label="Ward"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="postalCode"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-postal"
                  label="Postal code"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="country"
              render={({ field, fieldState }) => (
                <LabeledInputField
                  mode="edit"
                  id="addr-country"
                  label="Country"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </>
        ) : (
          <>
            <LabeledInputField
              mode="readonly"
              id="addr-fullName"
              label="Recipient full name"
              icon={User}
              value={dash(ro?.fullName)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-phone"
              label="Phone"
              value={dash(ro?.phone)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-line1"
              label="Address line 1"
              icon={MapPin}
              className="sm:col-span-2"
              value={dash(ro?.addressLine1)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-line2"
              label="Address line 2"
              className="sm:col-span-2"
              value={dash(ro?.addressLine2)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-city"
              label="City"
              value={dash(ro?.city)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-district"
              label="District"
              value={dash(ro?.district)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-ward"
              label="Ward"
              value={dash(ro?.ward)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-postal"
              label="Postal code"
              value={dash(ro?.postalCode)}
            />
            <LabeledInputField
              mode="readonly"
              id="addr-country"
              label="Country"
              value={dash(ro?.country)}
            />
          </>
        )}

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label
            htmlFor="addr-type"
            className="text-caption-lg-regular text-gray-500"
          >
            Address type
          </Label>
          {editingAddresses ? (
            <select
              id="addr-type"
              className="h-11 rounded-md border border-input bg-gray-50 px-3 text-body-regular text-gray-800 dark:bg-input/30"
              value={addressType ?? 'SHIPPING'}
              onChange={e =>
                setAddressValue('addressType', e.target.value as AddressType, {
                  shouldDirty: true,
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
              checked={Boolean(addressIsDefault)}
              onCheckedChange={v =>
                setAddressValue('isDefault', v === true, { shouldDirty: true })
              }
            />
            <Label
              htmlFor="addr-default"
              className="text-body-regular font-normal"
            >
              Default shipping address
            </Label>
          </div>
        ) : (
          <p className="text-caption-lg-regular text-gray-500 sm:col-span-2">
            {ro?.isDefault
              ? 'This is your default shipping address.'
              : 'Not set as default.'}
          </p>
        )}
      </div>

      {editingAddresses ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onSubmitAddress}
            disabled={savingAddress}
          >
            Save address
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancelAddress}
            disabled={savingAddress}
          >
            Cancel
          </Button>
          {selectedAddressId !== 'new' && !addressIsDefault ? (
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
  );
}
