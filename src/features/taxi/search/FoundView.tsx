import React from 'react';
import styles from './TaxiSearchOverlay.module.css';
import { SearchRadar } from './SearchRadar';
import type { DriverInfo, TaxiTypeInfo } from '../types';

interface Props {
  driver: DriverInfo;
  taxiType: TaxiTypeInfo;
  onOpenChat: () => void;
  onCancelOrder: () => void;
}

export function FoundView({ driver, taxiType, onOpenChat, onCancelOrder }: Props) {
  return (
    <>
      <SearchRadar color={taxiType.color} />
      <h3 className={styles.title}>Водитель найден!</h3>
      <div className={styles.result}>
        <div>
          <b>{driver.name}</b> · ⭐ {driver.rating}
        </div>
        <div>{driver.car}</div>
        <div>{driver.plate}</div>
        <div style={{ marginTop: 8 }}>
          Прибудет через ~{driver.etaMinutes} мин
        </div>
      </div>

      <div className={styles.foundActions}>
        <button className={styles.cancelBtn} onClick={onOpenChat}>
          💬 Написать
        </button>
        <button
          className={`${styles.cancelBtn} ${styles.dangerBtn}`}
          onClick={onCancelOrder}
        >
          Отменить
        </button>
      </div>
    </>
  );
}