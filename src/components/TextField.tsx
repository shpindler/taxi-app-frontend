import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="field">
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`field__input ${error ? 'field__input--error' : ''}`}
          {...rest}
        />
        {error && <span className="field__error">{error}</span>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';