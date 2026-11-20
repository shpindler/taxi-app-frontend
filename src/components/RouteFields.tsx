import React from 'react';
import styles from './RouteFields.module.css';

type ActiveField = 'pickup' | 'destination';

interface Props {
  pickupAddress: string;
  destinationAddress: string;
  activeField: ActiveField;
  isLocating: boolean;
  disabled: boolean;
  onFocusField: (field: ActiveField) => void;
  onUseMyLocation: () => void;
}

export function RouteFields({
  pickupAddress,
  destinationAddress,
  activeField,
  isLocating,
  disabled,
  onFocusField,
  onUseMyLocation,
}: Props) {
  const pickupBorder =
    activeField === 'pickup' ? styles.inputActivePickup : styles.inputIdle;
  const destinationBorder =
    activeField === 'destination' ? styles.inputActiveDestination : styles.inputIdle;

  return (
    <>
      <div className={styles.pickupRow}>
        <input
          type="text"
          placeholder="Откуда"
          value={pickupAddress || 'Нажмите на карту, чтобы выбрать точку посадки'}
          onFocus={() => onFocusField('pickup')}
          readOnly
          className={`${styles.input} ${styles.inputPickup} ${pickupBorder}`}
        />
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={isLocating || disabled}
          title="Использовать моё местоположение"
          className={styles.locateBtn}
        >
          {isLocating ? '⏳' : '📍'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Куда"
        value={destinationAddress || 'Нажмите на карту, чтобы выбрать пункт назначения'}
        onFocus={() => onFocusField('destination')}
        readOnly
        className={`${styles.input} ${destinationBorder}`}
      />
    </>
  );
}