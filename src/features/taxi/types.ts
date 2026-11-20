export type TaxiType = 'economy' | 'comfort' | 'business';

export type TaxiSearchStatus = 'idle' | 'searching' | 'found' | 'cancelled' | 'error';

export interface TaxiTypeInfo {
  id: TaxiType;
  label: string;
  description: string;
  color: string;
}

export const TAXI_TYPES: TaxiTypeInfo[] = [
  { id: 'economy', label: 'Эконом', description: 'Доступно', color: '#4caf50' },
  { id: 'comfort', label: 'Комфорт', description: 'Просторный салон', color: '#2196f3' },
  { id: 'business', label: 'Бизнес', description: 'Премиум-класс', color: '#9c27b0' },
];

export interface TaxiOrderPayload {
  type: TaxiType;
  pickup: { coords: [number, number]; address: string };
  destination: { coords: [number, number]; address: string };
}

export interface DriverInfo {
  id: string;
  name: string;
  car: string;
  plate: string;
  rating: number;
  etaMinutes: number;
}

export type ChatSender = 'passenger' | 'driver' | 'system';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: number; // Date.now()
}

export const QUICK_REPLIES: string[] = [
  'Я на месте',
  'Подождите 2 минуты',
  'Где вы стоите?',
  'Спасибо!',
];