import React from 'react';
import styles from './TaxiSearchOverlay.module.css';

interface Props {
  afterFound?: boolean;
  onClose: () => void;
}

export function CancelledView({ afterFound = false, onClose }: Props) {
  return (
    <>
      <h3 className={styles.title}>
        {afterFound ? 'Заказ отменён' : 'Поиск отменён'}
      </h3>
      <p className={styles.subtitle}>
        {afterFound
          ? 'Водитель уведомлён об отмене'
          : 'Вы можете заказать такси снова'}
      </p>
      <button className={styles.actionBtn} onClick={onClose}>
        Понятно
      </button>
    </>
  );
}