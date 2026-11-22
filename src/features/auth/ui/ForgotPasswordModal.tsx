'use client';

import { emailSchema } from '@contracts/auth';
import { Button, Input, Modal, useModal, useToast } from '@shared/ui';
import { useState, type FormEvent } from 'react';
import styles from './ForgotPasswordModal.module.css';

export const FORGOT_PASSWORD_MODAL = 'forgot-password';

export function ForgotPasswordModal() {
  return (
    <Modal name={FORGOT_PASSWORD_MODAL} title="Забыли пароль?">
      <ForgotPasswordForm />
    </Modal>
  );
}

function ForgotPasswordForm() {
  const { closeModal } = useModal();
  const showToast = useToast();
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(new FormData(event.currentTarget).get('email') ?? '');
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    closeModal();
    showToast('Отправка писем появится следующим шагом.');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.lead}>Пришлём ссылку для нового пароля на почту.</p>
      <Input
        label="Почта"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="example@mail.com"
        autoFocus
        required
        error={error}
      />
      <Button type="submit" block>
        <PlaneIcon />
        Прислать ссылку
      </Button>
    </form>
  );
}

function PlaneIcon() {
  return (
    <svg className={styles.plane} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M15 1 1 7.5l5 1.8L15 1 7.6 10.6 8 15l2.6-3.4L14 14z" fill="currentColor" />
    </svg>
  );
}
