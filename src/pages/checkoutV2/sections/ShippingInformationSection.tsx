import { JSX, useId } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FormField } from '@/components/FormField';
import type { ShippingInfoFormValues } from '../checkoutForm';

type ShippingInformationSectionProps = {
  form: UseFormReturn<ShippingInfoFormValues>;
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'VNPAY', label: 'VNPAY (Thanh toán online)' },
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
      <h2 className="text-h3-semi text-gray-900">Thông tin giao hàng</h2>

      <div className="flex flex-col items-start gap-4 relative w-full">
        {/* Recipient Name */}
        <FormField
          id={recipientNameId}
          label="Họ và tên người nhận"
          type="text"
          placeholder="Nguyễn Văn A"
          register={register('recipientName')}
          error={errors.recipientName}
          autoComplete="name"
        />

        {/* Phone */}
        <FormField
          id={phoneId}
          label="Số điện thoại"
          type="text"
          placeholder="0901234567"
          register={register('phone')}
          error={errors.phone}
          autoComplete="tel"
        />

        {/* Street Address */}
        <FormField
          id={addressId}
          label="Địa chỉ"
          type="text"
          placeholder="123 Lê Lợi, Quận 1"
          register={register('address')}
          error={errors.address}
          autoComplete="street-address"
        />

        {/* City + Province in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <FormField
            id={cityId}
            label="Thành phố"
            type="text"
            placeholder="Hồ Chí Minh"
            register={register('city')}
            error={errors.city}
            autoComplete="address-level2"
          />

          <FormField
            id={provinceId}
            label="Tỉnh / Thành phố"
            type="text"
            placeholder="Hồ Chí Minh"
            register={register('province')}
            error={errors.province}
            autoComplete="address-level1"
          />
        </div>

        {/* Zip Code */}
        <FormField
          id={zipCodeId}
          label="Mã bưu điện"
          type="text"
          placeholder="700000"
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
              label="Phương thức thanh toán"
              variant="selection"
              placeholder="Chọn phương thức thanh toán"
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
          label="Ghi chú"
          variant="paragraph"
          placeholder="Giao sau 5h chiều, gọi trước khi giao..."
          register={register('note')}
          error={errors.note}
          rows={3}
        />
      </div>
    </div>
  );
};
