import { JSX, useId } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import type { ShippingInfoFormValues } from '../checkoutForm';

type ShippingInformationSectionProps = {
  form: UseFormReturn<ShippingInfoFormValues>;
};

export const ShippingInformationSection = ({
  form,
}: ShippingInformationSectionProps): JSX.Element => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const countryId = useId();
  const cityId = useId();
  const zipCodeId = useId();
  const districtId = useId();
  const streetAddressId = useId();

  const countryOptions = [
    { value: 'Vietnam', label: 'Vietnam' },
    { value: 'Thailand', label: 'Thailand' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Malaysia', label: 'Malaysia' },
  ];

  return (
    <div className="flex flex-col items-start gap-6 relative w-full">
      <h2 className="text-h3-semi text-gray-900">Shipping Information</h2>

      <div className="flex flex-col items-start gap-4 relative w-full">{/* Full Name */}
        <FormField
          id={fullNameId}
          label="Full Name"
          type="text"
          placeholder="Full Name"
          register={register('fullName')}
          error={errors.fullName}
        />

        {/* Email */}
        <FormField
          id={emailId}
          label="Email Address"
          type="email"
          placeholder="Email Address"
          register={register('email')}
          error={errors.email}
          autoComplete="email"
        />

        {/* Phone */}
        <FormField
          id={phoneId}
          label="Phone Number"
          type="text"
          placeholder="Phone Number"
          register={register('phone')}
          error={errors.phone}
        />

        {/* Country */}
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <FormField
              id={countryId}
              label="Country"
              variant="selection"
              placeholder="Country"
              options={countryOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.country}
            />
          )}
        />

        {/* City / Zip Code / District Row */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <FormField
            id={cityId}
            label="City"
            type="text"
            placeholder="City"
            register={register('city')}
            error={errors.city}
          />
          <FormField
            id={zipCodeId}
            label="Zip Code"
            type="text"
            placeholder="Zip Code"
            register={register('zipCode')}
            error={errors.zipCode}
          />
          <FormField
            id={districtId}
            label="District"
            type="text"
            placeholder="District"
            register={register('district')}
            error={errors.district}
          />
        </div>

        {/* Street Address */}
        <FormField
          id={streetAddressId}
          label="Street Address"
          type="text"
          placeholder="Street Address"
          register={register('streetAddress')}
          error={errors.streetAddress}
        />
      </div>
    </div>
  );
};
