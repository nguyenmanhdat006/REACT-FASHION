import { z } from 'zod';

import type {
  Address,
  AddressType,
  CreateAddressRequest,
  User,
} from '@/types/auth/auth';
import { VIETNAMESE_PHONE_REGEX } from '@/utils/phone';

export const profileAccountSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z
    .string()
    .trim()
    .refine(v => v === '' || VIETNAMESE_PHONE_REGEX.test(v), {
      message: 'Phone number must be valid Vietnamese phone number',
    }),
});

export type ProfileAccountFormValues = z.infer<typeof profileAccountSchema>;

/** Chuỗi hiển thị readonly cho block Account (đã qua `dash` ở hook / caller). */
export type ProfileReadonlyDisplay = {
  fullName: string;
  email: string;
  phone: string;
};

export const emptyProfileAccount = (): ProfileAccountFormValues => ({
  fullName: '',
  phone: '',
});

export const profileToFormValues = (
  profile: Pick<User, 'fullName' | 'phone'> | null | undefined
): ProfileAccountFormValues => ({
  fullName: profile?.fullName?.trim() ?? '',
  phone: profile?.phone?.trim() ?? '',
});

export const toUpdateProfilePayload = (
  values: ProfileAccountFormValues
): Partial<User> => ({
  fullName: values.fullName.trim(),
  phone: values.phone.trim() || null,
});


const ADDRESS_TYPES = ['SHIPPING', 'BILLING', 'BOTH'] as const;

export const addressSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .refine(v => VIETNAMESE_PHONE_REGEX.test(v), {
      message: 'Phone number must be valid Vietnamese phone number',
    }),
  addressLine1: z.string().trim().min(1, 'Address line is required'),
  addressLine2: z.string().trim().optional().default(''),
  city: z.string().trim().min(1, 'City is required'),
  district: z.string().trim().optional().default(''),
  ward: z.string().trim().optional().default(''),
  postalCode: z.string().trim().optional().default(''),
  country: z.string().trim().optional().default('Vietnam'),
  isDefault: z.boolean().default(false),
  addressType: z.enum(ADDRESS_TYPES).default('SHIPPING'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export function emptyAddressForm(): AddressFormValues {
  return {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    ward: '',
    postalCode: '',
    country: 'Vietnam',
    isDefault: false,
    addressType: 'SHIPPING',
  };
}

export function addressToFormValues(a: Address): AddressFormValues {
  return {
    fullName: a.fullName,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? '',
    city: a.city,
    district: a.district ?? '',
    ward: a.ward ?? '',
    postalCode: a.postalCode ?? '',
    country: a.country ?? 'Vietnam',
    isDefault: a.isDefault,
    addressType: (a.addressType ?? 'SHIPPING') as AddressType,
  };
}

export function toCreatePayload(form: AddressFormValues): CreateAddressRequest {
  return {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    addressLine1: form.addressLine1.trim(),
    addressLine2: form.addressLine2?.trim() || undefined,
    city: form.city.trim(),
    district: form.district?.trim() || undefined,
    ward: form.ward?.trim() || undefined,
    postalCode: form.postalCode?.trim() || undefined,
    country: form.country?.trim() || undefined,
    isDefault: form.isDefault,
    addressType: form.addressType ?? 'SHIPPING',
  };
}
