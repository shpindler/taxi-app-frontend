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

export function extractDetail(data: any, fallback: string): string {
  if (!data) return fallback;

  const detail = data.detail;
  if (Array.isArray(detail) && detail.length) return String(detail[0]);
  if (typeof detail === 'string') return detail;

  if (typeof data === 'object') {
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const val = data[firstKey];
      if (Array.isArray(val) && val.length) return String(val[0]);
      if (typeof val === 'string') return val;
    }
  }

  return fallback;
}