import React from 'react';
import styles from './TaxiSearchOverlay.module.css';
import { SearchRadar } from './SearchRadar';
import type { TaxiTypeInfo } from '../types';

interface Props {
  elapsedSeconds: number;
  taxiType: TaxiTypeInfo;
  onCancel: () => void;
}

export function SearchingView({ elapsedSeconds, taxiType, onCancel }: Props) {
  return (
    <>
      <SearchRadar spinning />
      <h3 className={styles.title}>
        Ищем водителя<span className={styles.dots} />
      </h3>
      <p className={styles.subtitle}>
        Тариф «{taxiType.label}» · {elapsedSeconds} с
      </p>
      <button className={styles.cancelBtn} onClick={onCancel}>
        Отменить поиск
      </button>
    </>
  );
}