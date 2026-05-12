import { Mail, MapPin, Smartphone, User } from 'lucide-react';
import type { JSX } from 'react';

import { LabeledInputField } from '@/components/form/LabeledInputField';

export type ProfileDetailsSectionProps = {
  fullName: string;
  email: string;
  phone: string;
  locationDisplay: string;
};

export function ProfileDetailsSection({
  fullName,
  email,
  phone,
  locationDisplay,
}: ProfileDetailsSectionProps): JSX.Element {
  return (
    <section aria-label="Profile details" className="px-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <LabeledInputField
          mode="readonly"
          id="profile-fullName"
          label="Full name"
          icon={User}
          value={fullName}
        />
        <LabeledInputField
          mode="readonly"
          id="profile-email"
          label="Email address"
          icon={Mail}
          value={email}
        />
        <LabeledInputField
          mode="readonly"
          id="profile-phone"
          label="Phone number"
          icon={Smartphone}
          value={phone}
        />
        <LabeledInputField
          mode="readonly"
          id="profile-location"
          label="Default shipping area"
          icon={MapPin}
          value={locationDisplay}
        />
      </div>
    </section>
  );
}
