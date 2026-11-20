import React from 'react';
import styles from './TaxiSearchOverlay.module.css';

interface Props {
  color?: string;
  spinning?: boolean;
}

export function SearchRadar({ color, spinning = false }: Props) {
  return (
    <div
      className={styles.radar}
      aria-hidden="true"
      style={color ? { borderColor: color } : undefined}
    >
      {spinning && <div className={styles.sweep} />}
      <div className={styles.car}>🚕</div>
    </div>
  );
}
