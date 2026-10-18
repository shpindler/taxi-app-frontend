import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const BASE = '/api/auth';

async function request<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Ошибка сервера');
  }
  return res.json();
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<AuthResponse>(`${BASE}/login`, payload),
  register: (payload: RegisterPayload) =>
    request<AuthResponse>(`${BASE}/register`, payload),
};