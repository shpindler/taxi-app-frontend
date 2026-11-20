import { useCallback, useEffect, useRef, useState } from 'react';
import type { DriverInfo, TaxiOrderPayload, TaxiSearchStatus } from './types';

interface UseTaxiSearchResult {
  status: TaxiSearchStatus;
  driver: DriverInfo | null;
  error: string | null;
  elapsedSeconds: number;
  startSearch: (payload: TaxiOrderPayload) => void;
  cancelSearch: () => void;
  reset: () => void;
}

/**
 * Имитация запроса к серверу. Замените на реальный fetch:
 *   const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(payload), signal });
 */
function fakeRequestDriver(signal: AbortSignal): Promise<DriverInfo> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({
        id: 'drv-1',
        name: 'Алексей',
        car: 'Kia Rio, белый',
        plate: 'А123ВС77',
        rating: 4.9,
        etaMinutes: 4,
      });
    }, 5000);

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function useTaxiSearch(): UseTaxiSearchResult {
  const [status, setStatus] = useState<TaxiSearchStatus>('idle');
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    clearTimer();
  }, []);

  const startSearch = useCallback((payload: TaxiOrderPayload) => {
    abort(); // на случай повторного запуска
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('searching');
    setDriver(null);
    setError(null);
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    fakeRequestDriver(controller.signal)
      .then((found) => {
        if (controller.signal.aborted) return;
        clearTimer();
        setDriver(found);
        setStatus('found');
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        clearTimer();
        setError('Не удалось найти водителя');
        setStatus('error');
      });
  }, [abort]);

  const cancelSearch = useCallback(() => {
    if (status !== 'searching') return;
    abort();
    setStatus('cancelled');
    setError(null);
  }, [abort, status]);

  const reset = useCallback(() => {
    abort();
    setStatus('idle');
    setDriver(null);
    setError(null);
    setElapsedSeconds(0);
  }, [abort]);

  // Отмена запроса при размонтировании
  useEffect(() => {
    return () => abort();
  }, [abort]);

  return { status, driver, error, elapsedSeconds, startSearch, cancelSearch, reset };
}