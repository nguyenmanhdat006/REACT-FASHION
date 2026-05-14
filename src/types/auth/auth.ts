export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roles: string[];
  createdAt: string;
  updatedAt?: string;
  status?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export type SocialProvider = 'google' | 'facebook';

export interface OAuthExchangeRequest {
  code: string;
  redirectUri: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  refreshToken: string;
  password: string;
}

export type AddressType = 'SHIPPING' | 'BILLING' | 'BOTH';

/** User address (User Service). Legacy mocks may use `state` / `zipCode` — normalize in the service layer. */
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district?: string | null;
  ward?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isDefault: boolean;
  addressType?: AddressType;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  ward?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  addressType?: AddressType;
}

export type UpdateAddressRequest = Partial<CreateAddressRequest>;
