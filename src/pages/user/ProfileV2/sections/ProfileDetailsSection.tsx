import { Mail, MapPin, Smartphone } from 'lucide-react';
import type { JSX } from 'react';

import { ProfileReadOnlyField } from '../components/ProfileReadOnlyField';

export type ProfileDetailsSectionProps = {
  email: string;
  phone: string;
  locationDisplay: string;
};

export function ProfileDetailsSection({
  email,
  phone,
  locationDisplay,
}: ProfileDetailsSectionProps): JSX.Element {
  return (
    <section aria-label="Profile details" className="px-8">
      <div className="grid gap-6 sm:grid-cols-2">
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
    </section>
  );
}
