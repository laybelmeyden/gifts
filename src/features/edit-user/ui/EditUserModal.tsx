'use client';

import { updateUserSchema, type AdminUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { ApiError } from '@shared/api';
import { Button, Input, Modal, useModal, useToast } from '@shared/ui';
import { useState, type FormEvent } from 'react';
import { updateUser } from '../api/update-user';
import styles from './EditUserModal.module.css';

export const EDIT_USER_MODAL = 'edit-user';

export type EditUserField = 'name' | 'handle';

const text = t.admin.edit;

type EditUserModalProps = {
  user: AdminUser | null;
  field: EditUserField;
  onSaved: (user: AdminUser) => void;
};

export function EditUserModal({ user, field, onSaved }: EditUserModalProps) {
  return (
    <Modal name={EDIT_USER_MODAL} title={field === 'name' ? text.nameTitle : text.handleTitle}>
      {user && <EditUserForm key={`${user.id}-${field}`} user={user} field={field} onSaved={onSaved} />}
    </Modal>
  );
}

function EditUserForm({ user, field, onSaved }: EditUserModalProps & { user: AdminUser }) {
  const { closeModal } = useModal();
  const showToast = useToast();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get(field) ?? '');
    const parsed = updateUserSchema.safeParse({ [field]: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      onSaved(await updateUser(user.id, parsed.data));
      closeModal();
      showToast(text.saved);
    } catch (caught) {
      if (caught instanceof ApiError && caught.fields?.[field]) setError(caught.fields[field]);
      else showToast(caught instanceof ApiError ? caught.message : t.common.networkError);
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)} noValidate>
      <p className={styles.lead}>{text.lead(user.email)}</p>
      <Input
        label={field === 'name' ? t.fields.name : t.fields.handle}
        name={field}
        defaultValue={(field === 'name' ? user.name : user.handle) ?? ''}
        autoComplete="off"
        autoFocus
        required
        error={error}
      />
      <Button type="submit" block loading={pending}>
        {text.save}
      </Button>
    </form>
  );
}
