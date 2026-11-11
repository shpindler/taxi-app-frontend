import { useId } from 'react';
import {
  BRAND_LABEL,
  detectBrand,
  formatCardNumber,
  formatExpiry,
} from '../utils/card';
import styles from './CardInput.module.css';

export interface CardInputValue {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholder: string;
  saveCard: boolean;
}

interface Props {
  value: CardInputValue;
  onChange: (next: CardInputValue) => void;
  errors?: Partial<Record<keyof CardInputValue, string>>;
  /** «для оплаты поездок» или «для выплат» */
  purpose: 'payment' | 'payout';
}

export function CardInput({ value, onChange, errors, purpose }: Props) {
  const baseId = useId();
  const brand = detectBrand(value.cardNumber.replace(/\s/g, ''));

  const set = <K extends keyof CardInputValue>(
    key: K,
    v: CardInputValue[K]
  ) => onChange({ ...value, [key]: v });

  return (
    <fieldset className={styles.section}>
      <legend className={styles.title}>
        {purpose === 'payment' ? 'Способ оплаты' : 'Реквизиты для выплат'}
      </legend>
      <p className={styles.sub}>
        {purpose === 'payment'
          ? 'Карта будет использоваться для оплаты поездок. Данные защищены.'
          : 'На эту карту будут поступать выплаты за выполненные заказы.'}
      </p>

      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.gridFull}`}>
          <label className={styles.label} htmlFor={`${baseId}-num`}>
            Номер карты
          </label>
          <div className={styles.inputWrap}>
            <input
              id={`${baseId}-num`}
              className={`${styles.input} ${
                errors?.cardNumber ? styles.inputError : ''
              }`}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={value.cardNumber}
              onChange={(e) =>
                set('cardNumber', formatCardNumber(e.target.value))
              }
            />
            {value.cardNumber && (
              <span className={styles.brand}>{BRAND_LABEL[brand]}</span>
            )}
          </div>
          {errors?.cardNumber && (
            <span className={styles.errorText}>{errors.cardNumber}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${baseId}-exp`}>
            Срок действия
          </label>
          <input
            id={`${baseId}-exp`}
            className={`${styles.input} ${
              errors?.expiry ? styles.inputError : ''
            }`}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={value.expiry}
            onChange={(e) => set('expiry', formatExpiry(e.target.value))}
          />
          {errors?.expiry && (
            <span className={styles.errorText}>{errors.expiry}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${baseId}-cvc`}>
            CVC / CVV
          </label>
          <input
            id={`${baseId}-cvc`}
            className={`${styles.input} ${
              errors?.cvc ? styles.inputError : ''
            }`}
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="•••"
            maxLength={4}
            value={value.cvc}
            onChange={(e) =>
              set('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))
            }
          />
          {errors?.cvc && (
            <span className={styles.errorText}>{errors.cvc}</span>
          )}
        </div>

        <div className={`${styles.field} ${styles.gridFull}`}>
          <label className={styles.label} htmlFor={`${baseId}-holder`}>
            Имя владельца карты
          </label>
          <input
            id={`${baseId}-holder`}
            className={`${styles.input} ${
              errors?.cardholder ? styles.inputError : ''
            }`}
            autoComplete="cc-name"
            placeholder="IVAN PETROV"
            value={value.cardholder}
            onChange={(e) => set('cardholder', e.target.value.toUpperCase())}
          />
          {errors?.cardholder && (
            <span className={styles.errorText}>{errors.cardholder}</span>
          )}
        </div>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={value.saveCard}
          onChange={(e) => set('saveCard', e.target.checked)}
        />
        <span>
          {purpose === 'payment'
            ? 'Сохранить карту для будущих поездок'
            : 'Согласен на выплаты на эту карту'}
        </span>
      </label>
    </fieldset>
  );
}