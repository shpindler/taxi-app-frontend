import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, className, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className={styles.field}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error && styles.error, className]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';