// api/client.ts
import {
  requestJson,
} from './auth';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const API_BASE = import.meta.env.VITE_API_URL;

const TOKEN_KEY = 'token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function authHeaders(): Record<string, string> {
  const token = tokenStorage.get();
  return token ? { Authorization: `Token ${token}` } : {};
}

export type TripStatus =
  | 'searching'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

export interface Trip {
  id: number;
  status: TripStatus;
  pickup: GeoPoint;
  destination: GeoPoint;
  driver: number | null;
  driver_email?: string | null;
  passenger: number;
  passenger_email?: string | null;
  price: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTripPayload {
  pickup: GeoPoint;
  destination: GeoPoint;
  price?: string;
}

// ---------- Поездки ----------

export const tripsApi = {
  list: (params?: {
    status?: TripStatus;
    passenger?: 'me';
    driver?: 'me';
  }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.passenger) search.set('passenger', params.passenger);
    if (params?.driver) search.set('driver', params.driver);
    const qs = search.toString();
    return fetch(`/api/trips/${qs ? `?${qs}` : ''}`).then((r) => r.json());
  },

  get: (id: number) => fetch(`/api/trips/${id}/`).then((r) => r.json()),

  create: (payload: CreateTripPayload) =>
    requestJson<Trip>('/api/trips/', { method: 'POST', body: payload }),

  cancel: (id: number) =>
    requestJson<Trip>(`/api/trips/${id}/cancel/`, { method: 'POST' }),

  accept: (id: number) =>
    requestJson<Trip>(`/api/trips/${id}/accept/`, { method: 'POST' }),

  complete: (id: number) =>
    requestJson<Trip>(`/api/trips/${id}/complete/`, { method: 'POST' }),
};

// ---------- Профиль ----------

export const profileApi = {
  getMe: () => fetch('/api/auth/me/').then((r) => r.json()),
};
