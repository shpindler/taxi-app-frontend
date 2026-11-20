import React from 'react';
import styles from './TaxiSearchOverlay.module.css';

interface Props {
  message?: string | null;
  onClose: () => void;
}

export function ErrorView({ message, onClose }: Props) {
  return (
    <>
      <h3 className={styles.title}>Ошибка</h3>
      <p className={styles.subtitle}>
        {message ?? 'Не удалось найти водителя'}
      </p>
      <button className={styles.actionBtn} onClick={onClose}>
        Закрыть
      </button>
    </>
  );
}