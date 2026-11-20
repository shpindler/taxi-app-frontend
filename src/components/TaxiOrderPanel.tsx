import React from 'react';
import styles from './TaxiOrderPanel.module.css';
import { RouteFields } from './RouteFields';
import { TaxiTypeSelector } from '../features/taxi/TaxiTypeSelector';
import type { TaxiType } from '../features/taxi/types';

type ActiveField = 'pickup' | 'destination';

interface Props {
  pickupAddress: string;
  destinationAddress: string;
  activeField: ActiveField;
  isLocating: boolean;
  isBlocking: boolean;
  isSearching: boolean;
  canOrder: boolean;
  taxiType: TaxiType;
  onFocusField: (field: ActiveField) => void;
  onUseMyLocation: () => void;
  onTaxiTypeChange: (type: TaxiType) => void;
  onOrder: () => void;
}

export function TaxiOrderPanel({
  pickupAddress,
  destinationAddress,
  activeField,
  isLocating,
  isBlocking,
  isSearching,
  canOrder,
  taxiType,
  onFocusField,
  onUseMyLocation,
  onTaxiTypeChange,
  onOrder,
}: Props) {
  const disabled = !canOrder || isBlocking;

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Куда поедем?</h2>

      <RouteFields
        pickupAddress={pickupAddress}
        destinationAddress={destinationAddress}
        activeField={activeField}
        isLocating={isLocating}
        disabled={isBlocking}
        onFocusField={onFocusField}
        onUseMyLocation={onUseMyLocation}
      />

      <TaxiTypeSelector
        value={taxiType}
        onChange={onTaxiTypeChange}
        disabled={isBlocking}
      />

      <button
        onClick={onOrder}
        disabled={disabled}
        className={`${styles.orderBtn} ${
          disabled ? styles.orderBtnDisabled : styles.orderBtnEnabled
        }`}
      >
        {isSearching ? 'Идёт поиск…' : 'Заказать такси'}
      </button>
    </div>
  );
}