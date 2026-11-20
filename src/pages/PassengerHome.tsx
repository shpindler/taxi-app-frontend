// src/pages/PassengerHomePage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PassengerHomePageCanvas } from '../components/PassengerHomePageCanvas';
import { TaxiOrderPanel } from '../components/TaxiOrderPanel';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TaxiSearchOverlay } from '../features/taxi/search/TaxiSearchOverlay';
import { DriverChatOverlay } from '../features/taxi/DriverChatOverlay';
import { useTaxiSearch } from '../features/taxi/useTaxiSearch';
import { useDriverChat } from '../features/taxi/useDriverChat';
import { GEOCODER_API_KEY, LOCATION } from '../features/taxi/constants';
import { TAXI_TYPES, type TaxiType } from '../features/taxi/types';

type PendingCancel = 'search' | 'order' | null;

export function PassengerHomePage() {
  // --- Точки маршрута ---
  const [pickupPoint, setPickupPoint] = useState<[number, number] | null>(LOCATION.center);
  const [destinationPoint, setDestinationPoint] = useState<[number, number] | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [activeField, setActiveField] = useState<'pickup' | 'destination'>('pickup');
  const [isLocating, setIsLocating] = useState(false);

  // --- Тариф ---
  const [taxiType, setTaxiType] = useState<TaxiType>('economy');

  // --- Чат ---
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- Подтверждение отмены ---
  const [pendingCancel, setPendingCancel] = useState<PendingCancel>(null);

  // --- Хуки поиска и чата ---
  const search = useTaxiSearch();
  const chat = useDriverChat(search.driver);

  const isSearching = search.status === 'searching';
  const isSearchOverlayOpen = search.status !== 'idle';
  const isBlocking = isSearchOverlayOpen || isChatOpen;

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Обратное геокодирование ---
  const getAddressFromCoords = useCallback(
    async (coords: [number, number], callback: (address: string) => void) => {
      try {
        const url = `https://geocode-maps.yandex.ru/v1/?apikey=${GEOCODER_API_KEY}&geocode=${coords[0]},${coords[1]}&format=json&results=1&lang=ru_RU`;
        const response = await fetch(url);
        if (!response.ok) {
          callback('Не удалось получить адрес');
          return;
        }
        const data = await response.json();
        const featureMember = data?.response?.GeoObjectCollection?.featureMember;
        if (featureMember && featureMember.length > 0) {
          const address = featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;
          callback(address || 'Адрес не найден');
        } else {
          callback('Адрес не найден');
        }
      } catch (err) {
        console.error('Ошибка геокодирования:', err);
        callback('Не удалось получить адрес');
      }
    },
    []
  );

  // --- Определение текущего местоположения ---
  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPickupAddress('Геолокация не поддерживается');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setPickupPoint(coords);
        setActiveField('pickup');
        getAddressFromCoords(coords, setPickupAddress);
        setIsLocating(false);
      },
      (err) => {
        console.error('Ошибка геолокации:', err);
        setPickupAddress('Не удалось определить местоположение');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [getAddressFromCoords]);

  // --- Клик по карте ---
  const handleMapClick = useCallback(
    (object: any, event: any) => {
      if (isBlocking) return;
      const coords = event?.coordinates;
      if (!coords) return;

      if (activeField === 'pickup') {
        setPickupPoint(coords);
      } else {
        setDestinationPoint(coords);
      }

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        getAddressFromCoords(coords, (address) => {
          if (activeField === 'pickup') {
            setPickupAddress(address);
          } else {
            setDestinationAddress(address);
          }
        });
      }, 500);
    },
    [activeField, getAddressFromCoords, isBlocking]
  );

  // --- Очистка таймера при размонтировании ---
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // --- Запрос геолокации при монтировании ---
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setPickupPoint(coords);
          getAddressFromCoords(coords, setPickupAddress);
        },
        () => {
          /* оставляем LOCATION.center */
        }
      );
    }
  }, [getAddressFromCoords]);

  // --- Заказ такси ---
  const handleOrderTaxi = () => {
    if (!pickupPoint || !destinationPoint) return;
    setIsChatOpen(false);
    chat.resetChat();
    search.startSearch({
      type: taxiType,
      pickup: { coords: pickupPoint, address: pickupAddress },
      destination: { coords: destinationPoint, address: destinationAddress },
    });
  };

  // --- Запрос подтверждения отмены ---
  const requestCancelSearch = () => setPendingCancel('search');
  const requestCancelOrder = () => setPendingCancel('order');
  const dismissCancel = () => setPendingCancel(null);

  // --- Выполнение отмены после подтверждения ---
  const confirmCancel = () => {
    if (pendingCancel === 'search') {
      search.cancelSearch();
    } else if (pendingCancel === 'order') {
      setIsChatOpen(false);
      chat.resetChat();
      search.reset();
    }
    setPendingCancel(null);
  };

  // --- Закрытие оверлея поиска (терминальные статусы) ---
  const handleCloseSearch = () => {
    setIsChatOpen(false);
    chat.resetChat();
    search.reset();
  };

  const taxiTypeInfo = TAXI_TYPES.find((t) => t.id === taxiType) ?? TAXI_TYPES[0];
  const canOrder = !!pickupPoint && !!destinationPoint;

  const cancelDialogConfig =
    pendingCancel === 'search'
      ? {
          title: 'Отменить поиск?',
          message: 'Мы перестанем искать водителя. Вы сможете заказать такси снова.',
          confirmLabel: 'Отменить поиск',
        }
      : pendingCancel === 'order'
      ? {
          title: 'Отменить заказ?',
          message: 'Водитель уже найден и едет к вам. Заказ будет отменён.',
          confirmLabel: 'Отменить заказ',
        }
      : null;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <PassengerHomePageCanvas
        location={LOCATION}
        pickupPoint={pickupPoint}
        destinationPoint={destinationPoint}
        onClick={handleMapClick}
      />

      <TaxiOrderPanel
        pickupAddress={pickupAddress}
        destinationAddress={destinationAddress}
        activeField={activeField}
        isLocating={isLocating}
        isBlocking={isBlocking}
        isSearching={isSearching}
        canOrder={canOrder}
        taxiType={taxiType}
        onFocusField={setActiveField}
        onUseMyLocation={useMyLocation}
        onTaxiTypeChange={setTaxiType}
        onOrder={handleOrderTaxi}
      />

      <TaxiSearchOverlay
        status={search.status}
        driver={search.driver}
        error={search.error}
        elapsedSeconds={search.elapsedSeconds}
        taxiType={taxiTypeInfo}
        onCancel={requestCancelSearch}
        onCancelOrder={requestCancelOrder}
        onClose={handleCloseSearch}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {isChatOpen && search.driver && (
        <DriverChatOverlay
          driver={search.driver}
          messages={chat.messages}
          isDriverTyping={chat.isDriverTyping}
          onSend={chat.sendMessage}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {cancelDialogConfig && (
        <ConfirmDialog
          title={cancelDialogConfig.title}
          message={cancelDialogConfig.message}
          confirmLabel={cancelDialogConfig.confirmLabel}
          cancelLabel="Нет"
          onConfirm={confirmCancel}
          onCancel={dismissCancel}
        />
      )}
    </div>
  );
}