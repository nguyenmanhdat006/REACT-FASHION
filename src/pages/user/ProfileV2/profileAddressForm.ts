import type { Address, CreateAddressRequest } from '@/types/auth/auth';
import { isVietnamesePhone } from '@/utils/phone';

export type AddressFormValues = CreateAddressRequest;

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
    addressType: a.addressType ?? 'SHIPPING',
  };
}

export function validateAddressForm(form: AddressFormValues): Record<string, string> {
  const next: Record<string, string> = {};
  if (!form.fullName.trim()) next.fullName = 'Full name is required';
  if (!form.phone.trim()) next.phone = 'Phone is required';
  else if (!isVietnamesePhone(form.phone)) {
    next.phone = 'Phone number must be valid Vietnamese phone number';
  }
  if (!form.addressLine1.trim()) next.addressLine1 = 'Address line is required';
  if (!form.city.trim()) next.city = 'City is required';
  return next;
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
