export type CardBrand = 'visa' | 'mastercard' | 'mir' | 'unionpay' | 'unknown';

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^2(20[0-9]|21[0-9]|2[0-9]{2})/.test(digits)) return 'mir';
  if (/^62/.test(digits)) return 'unionpay';
  return 'unknown';
}

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  mir: 'МИР',
  unionpay: 'UnionPay',
  unknown: 'Карта',
};

/** Алгоритм Луна */
export function luhnValid(digits: string): boolean {
  if (digits.length < 12) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** Маска номера: 1234 5678 9012 3456 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** Маска срока MM/YY */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Проверка срока: месяц 01–12, дата не в прошлом */
export function expiryValid(exp: string): boolean {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month, 1);
  return expiry > now;
}

/** Нормализация к виду, который ждёт бэкенд: "4242424242424242" */
export function stripSpaces(value: string): string {
  return value.replace(/\s+/g, '');
}