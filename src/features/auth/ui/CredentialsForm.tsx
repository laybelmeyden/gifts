'use client';

import { signInSchema, signUpSchema } from '@contracts/auth';
import { authClient } from '@shared/api';
import { routes } from '@shared/config';
import { fieldErrors, type FieldErrors } from '@shared/lib';
import { Button, Input } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from '../model/auth-errors';
import styles from './CredentialsForm.module.css';

type Mode = 'sign-in' | 'sign-up';

async function submitCredentials(mode: Mode, email: string, password: string) {
  if (mode === 'sign-in') return authClient.signIn.email({ email, password });
  return authClient.signUp.email({ email, password, name: email.split('@')[0] ?? email });
}

export function CredentialsForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const isSignUp = mode === 'sign-up';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const schema = isSignUp ? signUpSchema : signInSchema;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setPending(true);

    try {
      const { error } = await submitCredentials(mode, parsed.data.email, parsed.data.password);
      if (error) {
        setFormError(authErrorMessage(error));
        setPending(false);
        return;
      }
    } catch {
      setFormError(NETWORK_ERROR_MESSAGE);
      setPending(false);
      return;
    }

    // Кнопка остаётся заблокированной до перехода, чтобы не отправить форму дважды.
    router.replace(routes.myList);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Почта"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        error={errors.email}
      />
      <Input
        label="Пароль"
        name="password"
        type="password"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        required
        error={errors.password}
      />
      {formError && (
        <p className="error" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" block disabled={pending}>
        {isSignUp ? 'Создать' : 'Войти'}
      </Button>
    </form>
  );
}
