export type UserRole = 'passenger' | 'driver';

export interface LoginPayload {
  phone: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: UserRole;
  };
}