import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib';
import styles from './Input.module.css';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  end?: ReactNode;
};

export function Input({ label, error, end, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label}
      <span className={cx('px', styles.control, error && styles.invalid)}>
        <input
          id={inputId}
          className={cx(styles.input, className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        {end}
      </span>
      {error && (
        <span className={styles.error} id={errorId}>
          * {error}
        </span>
      )}
    </label>
  );
}
