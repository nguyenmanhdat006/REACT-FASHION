import { z } from 'zod';
import { VIETNAMESE_PHONE_REGEX } from '@/utils/phone';

export const shippingInfoSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .refine(v => VIETNAMESE_PHONE_REGEX.test(v), {
      message: 'Phone number must be valid Vietnamese phone number',
    }),
  country: z.string().trim().min(1, 'Country is required'),
  city: z.string().trim().min(1, 'City is required'),
  zipCode: z.string().trim().optional().default(''),
  district: z.string().trim().optional().default(''),
  streetAddress: z.string().trim().min(1, 'Street address is required'),
});

export type ShippingInfoFormValues = z.infer<typeof shippingInfoSchema>;

export const emptyShippingInfo = (): ShippingInfoFormValues => ({
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  zipCode: '',
  district: '',
  streetAddress: '',
});

export const toCheckoutPayload = (
  values: ShippingInfoFormValues
) => ({
  fullName: values.fullName.trim(),
  email: values.email.trim(),
  phone: values.phone.trim(),
  country: values.country.trim(),
  city: values.city.trim(),
  zipCode: values.zipCode.trim(),
  district: values.district.trim(),
  streetAddress: values.streetAddress.trim(),
});
