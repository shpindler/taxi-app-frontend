import React from 'react';
import styles from './TaxiSearchOverlay.module.css';
import { SearchingView } from './SearchingView';
import { FoundView } from './FoundView';
import { CancelledView } from './CancelledView';
import { ErrorView } from './ErrorView';
import type { DriverInfo, TaxiSearchStatus, TaxiTypeInfo } from '../types';

interface Props {
  status: TaxiSearchStatus;
  driver: DriverInfo | null;
  error: string | null;
  elapsedSeconds: number;
  taxiType: TaxiTypeInfo;
  onCancel: () => void;
  onCancelOrder: () => void;
  onClose: () => void;
  onOpenChat: () => void;
}

export function TaxiSearchOverlay({
  status,
  driver,
  error,
  elapsedSeconds,
  taxiType,
  onCancel,
  onCancelOrder,
  onClose,
  onOpenChat,
}: Props) {
  if (status === 'idle') return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        {status === 'searching' && (
          <SearchingView
            elapsedSeconds={elapsedSeconds}
            taxiType={taxiType}
            onCancel={onCancel}
          />
        )}

        {status === 'found' && driver && (
          <FoundView
            driver={driver}
            taxiType={taxiType}
            onOpenChat={onOpenChat}
            onCancelOrder={onCancelOrder}
          />
        )}

        {status === 'cancelled' && (
          <CancelledView afterFound={!!driver} onClose={onClose} />
        )}

        {status === 'error' && (
          <ErrorView message={error} onClose={onClose} />
        )}
      </div>
    </div>
  );
}