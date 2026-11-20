import React from 'react';
import styles from './TaxiTypeSelector.module.css';
import { TAXI_TYPES, type TaxiType } from './types';

interface Props {
  value: TaxiType;
  onChange: (value: TaxiType) => void;
  disabled?: boolean;
}

export function TaxiTypeSelector({ value, onChange, disabled }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Тип такси</div>
      <div className={styles.row}>
        {TAXI_TYPES.map((type) => {
          const isActive = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              disabled={disabled}
              className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
              style={{
                borderColor: isActive ? type.color : undefined,
                backgroundColor: isActive ? `${type.color}15` : undefined,
              }}
            >
              <div
                className={styles.optionLabel}
                style={isActive ? { color: type.color } : undefined}
              >
                {type.label}
              </div>
              <div className={styles.optionDesc}>{type.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}