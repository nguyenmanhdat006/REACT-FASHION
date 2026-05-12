/** Vietnamese phone: `+84` or `0` followed by 9 digits (per User Service contract). */
export const VIETNAMESE_PHONE_REGEX = /^(\+84|0)[0-9]{9}$/;

export const isVietnamesePhone = (value: string): boolean =>
  VIETNAMESE_PHONE_REGEX.test(value.trim());
