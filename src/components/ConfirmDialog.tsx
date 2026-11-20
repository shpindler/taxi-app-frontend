import React from 'react';
import styles from './ConfirmDialog.module.css';

interface Props {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Нет',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className={styles.overlay}
      role="alertdialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}