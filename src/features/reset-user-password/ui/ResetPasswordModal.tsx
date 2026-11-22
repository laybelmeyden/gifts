'use client';

import { setUserPasswordSchema, type AdminUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { ApiError } from '@shared/api';
import { Button, Modal, PasswordInput, useModal, useToast } from '@shared/ui';
import { useState, type FormEvent } from 'react';
import { setUserPassword } from '../api/set-user-password';
import styles from './ResetPasswordModal.module.css';

export const RESET_PASSWORD_MODAL = 'reset-user-password';

const text = t.admin.reset;

export function ResetPasswordModal({ user }: { user: AdminUser | null }) {
  return (
    <Modal name={RESET_PASSWORD_MODAL} title={text.title}>
      {user && <ResetPasswordForm key={user.id} user={user} />}
    </Modal>
  );
}

function ResetPasswordForm({ user }: { user: AdminUser }) {
  const { closeModal } = useModal();
  const showToast = useToast();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = setUserPasswordSchema.safeParse({
      password: new FormData(event.currentTarget).get('password') ?? '',
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      await setUserPassword(user.id, parsed.data);
      closeModal();
      showToast(text.done);
    } catch (caught) {
      if (caught instanceof ApiError && caught.fields?.password) setError(caught.fields.password);
      else showToast(caught instanceof ApiError ? caught.message : t.common.networkError);
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)} noValidate>
      <p className={styles.lead}>{text.lead(user.email)}</p>
      <PasswordInput
        label={text.label}
        name="password"
        autoComplete="new-password"
        placeholder={t.fields.passwordPlaceholder}
        autoFocus
        required
        error={error}
      />
      <Button type="submit" block loading={pending}>
        {text.submit}
      </Button>
    </form>
  );
}
