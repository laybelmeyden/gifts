'use client';

import { t } from '@contracts/i18n';
import { useState, type InputHTMLAttributes } from 'react';
import { Input } from './Input';
import styles from './PasswordInput.module.css';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
};

export function PasswordInput({ ...rest }: PasswordInputProps) {
  const [shown, setShown] = useState(false);

  return (
    <Input
      {...rest}
      type={shown ? 'text' : 'password'}
      end={
        <button
          className={styles.eye}
          type="button"
          aria-label={shown ? t.fields.hidePassword : t.fields.showPassword}
          onClick={() => setShown((value) => !value)}
        >
          <Eye open={shown} />
        </button>
      }
    />
  );
}

function Eye({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="2" fill="currentColor" />
      {open && <path d="M3 15L15 3" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}
