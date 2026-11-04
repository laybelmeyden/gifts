import { useId, type InputHTMLAttributes } from 'react';
import { cx } from '../../lib';
import styles from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cx(styles.input, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      )}
    </label>
  );
}
