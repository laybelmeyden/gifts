'use client';

import { t } from '@contracts/i18n';
import { deleteGift } from '@entities/gift';
import { ApiError } from '@shared/api';
import { cx } from '@shared/lib';
import { ConfirmModal, useModal, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './ManageGift.module.css';

const DELETE_GIFT_MODAL = 'delete-gift';

type DeleteGiftProps = {
  giftId: string;
  title: string;
  /** Страница вишлиста, куда вернуться после удаления. */
  redirectTo: string;
};

export function DeleteGift({ giftId, title, redirectTo }: DeleteGiftProps) {
  const router = useRouter();
  const showToast = useToast();
  const { openModal, closeModal } = useModal();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    try {
      await deleteGift(giftId);
      closeModal();
      showToast(t.gift.deleted);
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
      setDeleting(false);
    }
  }

  return (
    <>
      <button className={styles.delete} type="button" onClick={() => openModal(DELETE_GIFT_MODAL)}>
        <span className={cx(styles.icon, styles.trash)} aria-hidden="true" />
        {t.gift.delete}
      </button>
      <ConfirmModal
        name={DELETE_GIFT_MODAL}
        title={t.gift.deleteTitle}
        lead={t.gift.deleteLead(title)}
        keepLabel={t.gift.deleteKeep}
        confirmLabel={t.gift.deleteConfirm}
        loading={deleting}
        onConfirm={() => void remove()}
      />
    </>
  );
}
