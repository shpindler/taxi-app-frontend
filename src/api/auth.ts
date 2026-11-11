import type {
  AuthResponse,
  LoginPayload,
  DriverRegisterPayload,
  PassengerRegisterPayload,
} from '../types/auth';

const API_HOST = import.meta.env.VITE_API_URL;

const BASE = `${API_HOST}/api`;

// Тип ошибки с телом ответа сервера
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Извлечение читаемого сообщения из тела ответа DRF
function extractDetail(data: any, fallback: string): string {
  if (!data) return fallback;

  const detail = data.detail;
  if (Array.isArray(detail) && detail.length) return String(detail[0]);
  if (typeof detail === 'string') return detail;

  // DRF: { field: ["..."] } — берём первое поле с ошибкой
  if (typeof data === 'object') {
    const firstKey = Object.keys(data)[0];
    const val = data[firstKey];
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === 'string') return val;
  }

  return fallback;
}

async function requestJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = extractDetail(data, `Ошибка сервера (${res.status})`);
    throw new ApiError(message, res.status, data);
  }

  return res.json();
}

async function requestForm<T>(url: string, form: FormData): Promise<T> {
  const res = await fetch(url, { method: 'POST', body: form });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = extractDetail(data, `Ошибка сервера (${res.status})`);
    throw new ApiError(message, res.status, data);
  }

  return res.json();
}

export const authApi = {
  driverLogin: (payload: LoginPayload) =>
    requestJson<AuthResponse>(`${BASE}/drivers/auth/login/`, payload),

  passengerLogin: (payload: LoginPayload) =>
    requestJson<AuthResponse>(`${BASE}/passengers/auth/login/`, payload),

  registerDriver: (payload: DriverRegisterPayload) => {
    const form = new FormData();
    form.append('first_name', payload.name.split(' ')[0]);
    form.append('last_name', payload.name.split(' ')[1]);
    form.append('phone', payload.phone);
    form.append('email', payload.email);
    form.append('password', payload.password);

    form.append('license', payload.driverDocuments.license);
    form.append(
      'vehicle_registration',
      payload.driverDocuments.vehicleRegistration
    );
    form.append('taxi_registry', payload.driverDocuments.taxiRegistry);
    console.log(payload);
    return requestForm<AuthResponse>(`${BASE}/drivers/`, form);
  },

  registerPassenger: (payload: PassengerRegisterPayload) => {
    const form = new FormData();
    form.append('first_name', payload.name.split(' ')[0]);
    form.append('last_name', payload.name.split(' ')[1]);
    form.append('phone', payload.phone);
    form.append('email', payload.email);
    form.append('password', payload.password);

    return requestForm<AuthResponse>(`${BASE}/passengers/`, form);
  },
};