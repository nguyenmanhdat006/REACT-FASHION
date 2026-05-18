import { JSX, useId } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import type { ShippingInfoFormValues } from '../checkoutForm';

type ShippingInformationSectionProps = {
  form: UseFormReturn<ShippingInfoFormValues>;
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'COD', label: 'Cash on Delivery (COD)' },
  { value: 'VNPAY', label: 'VNPAY (Online Payment)' },
];

export const ShippingInformationSection = ({
  form,
}: ShippingInformationSectionProps): JSX.Element => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  // Stable IDs for accessibility
  const recipientNameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const cityId = useId();
  const provinceId = useId();
  const zipCodeId = useId();
  const paymentMethodId = useId();
  const noteId = useId();

  return (
    <div className="flex flex-col items-start gap-6 relative w-full">
      <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>

      <div className="flex flex-col items-start gap-4 relative w-full">
        {/* Recipient Name */}
        <FormField
          id={recipientNameId}
          label="Full Name"
          type="text"
          placeholder="Full Name"
          register={register('recipientName')}
          error={errors.recipientName}
          autoComplete="name"
        />

        {/* Phone */}
        <FormField
          id={phoneId}
          label="Phone Number"
          type="text"
          placeholder="Phone Number"
          register={register('phone')}
          error={errors.phone}
          autoComplete="tel"
        />

        {/* Street Address */}
        <FormField
          id={addressId}
          label="Street Address"
          type="text"
          placeholder="Street Address"
          register={register('address')}
          error={errors.address}
          autoComplete="street-address"
        />

        {/* City + Province in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <FormField
            id={cityId}
            label="City"
            type="text"
            placeholder="City"
            register={register('city')}
            error={errors.city}
            autoComplete="address-level2"
          />

          <FormField
            id={provinceId}
            label="Province / State"
            type="text"
            placeholder="Province / State"
            register={register('province')}
            error={errors.province}
            autoComplete="address-level1"
          />
        </div>

        {/* Zip Code */}
        <FormField
          id={zipCodeId}
          label="Zip Code"
          type="text"
          placeholder="Zip Code"
          register={register('zipCode')}
          error={errors.zipCode}
          autoComplete="postal-code"
        />

        {/* Payment Method */}
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <FormField
              id={paymentMethodId}
              label="Payment Method"
              variant="selection"
              placeholder="Select payment method"
              options={PAYMENT_METHOD_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.paymentMethod}
            />
          )}
        />

        {/* Note */}
        <FormField
          id={noteId}
          label="Note"
          variant="paragraph"
          placeholder="Deliver after 5 PM, call before delivery..."
          register={register('note')}
          error={errors.note}
          rows={3}
        />
      </div>
    </div>
  );
};
