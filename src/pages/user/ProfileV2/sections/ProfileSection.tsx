import { Mail, Smartphone, User } from 'lucide-react';
import type { JSX } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { LabelButton } from '@/components/buttons/LabelButton';
import { LabeledInputField } from '@/components/form/LabeledInputField';
import type { ProfileAccountFormValues } from '@/pages/user/ProfileV2/profileForm';

export type ProfileReadonlyDisplay = {
  fullName: string;
  email: string;
  phone: string;
};

export type ProfileSectionProps = {
  editingProfile: boolean;
  profileForm: UseFormReturn<ProfileAccountFormValues>;
  onSubmitProfile: () => void;
  onCancelProfile: () => void;
  profileReadonly: ProfileReadonlyDisplay;
};

export function ProfileSection({
  editingProfile,
  profileForm,
  onSubmitProfile,
  onCancelProfile,
  profileReadonly,
}: ProfileSectionProps): JSX.Element {
  const {
    control: profileControl,
    formState: { isSubmitting: savingProfile },
  } = profileForm;

  return (
    <section aria-label="Account" className="flex flex-col gap-4">
      <h2 className="text-h6-semi text-gray-black dark:text-gray-white">
        Account
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {editingProfile ? (
          <Controller
            control={profileControl}
            name="fullName"
            render={({ field, fieldState }) => (
              <LabeledInputField
                mode="edit"
                id="profile-fullName"
                label="Full name"
                icon={User}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : (
          <LabeledInputField
            mode="readonly"
            id="profile-fullName"
            label="Full name"
            icon={User}
            value={profileReadonly.fullName}
          />
        )}
        <LabeledInputField
          mode="readonly"
          id="profile-email"
          label="Email address"
          icon={Mail}
          value={profileReadonly.email}
        />
        {editingProfile ? (
          <Controller
            control={profileControl}
            name="phone"
            render={({ field, fieldState }) => (
              <LabeledInputField
                mode="edit"
                id="profile-phone"
                label="Phone number"
                icon={Smartphone}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        ) : (
          <LabeledInputField
            mode="readonly"
            id="profile-phone"
            label="Phone number"
            icon={Smartphone}
            value={profileReadonly.phone}
          />
        )}
      </div>
      {editingProfile ? (
        <div className="flex flex-wrap gap-2">
          <LabelButton
            label="Save profile"
            tone="primary"
            className="px-6 py-2.5"
            onClick={onSubmitProfile}
            disabled={savingProfile}
          />
          <LabelButton
            label="Cancel"
            tone="default"
            className="px-6 py-2.5"
            onClick={onCancelProfile}
            disabled={savingProfile}
          />
        </div>
      ) : null}
    </section>
  );
}
