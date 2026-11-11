export type UserRole = 'passenger' | 'driver';

export type DriverDocumentKind =
  | 'license'
  | 'vehicleRegistration'
  | 'taxiRegistry';

export interface LoginPayload {
  login: string;
  password: string;
}

export interface DriverRegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  driverDocuments: Record<DriverDocumentKind, File>;
}

export interface PassengerRegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export interface IError {
  detail: string;
}