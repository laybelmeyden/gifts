'use client';

import { t } from '@contracts/i18n';
import { ApiError } from '@shared/api';
import { routes } from '@shared/config';
import { ConfirmModal, Dropdown, useModal, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteWishlist } from '../api/delete-wishlist';
import styles from './WishlistMenu.module.css';

const DELETE_WISHLIST_MODAL = 'delete-wishlist';

const text = t.wishlist;

type WishlistMenuProps = {
  wishlistId: string;
  title: string;
  /** Куда уйти после удаления; по умолчанию - к своим вишлистам. */
  redirectTo?: string;
};

export function WishlistMenu({ wishlistId, title, redirectTo = routes.myList }: WishlistMenuProps) {
  const router = useRouter();
  const showToast = useToast();
  const { openModal, closeModal } = useModal();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    try {
      await deleteWishlist(wishlistId);
      closeModal();
      showToast(text.deleted);
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : t.common.networkError);
      setDeleting(false);
    }
  }

  return (
    <>
      <Dropdown
        label={text.more}
        placement="below"
        triggerClassName={styles.trigger}
        items={[{ label: text.delete, danger: true, onSelect: () => openModal(DELETE_WISHLIST_MODAL) }]}
      >
        <span className={styles.dots} aria-hidden="true" />
      </Dropdown>
      <ConfirmModal
        name={DELETE_WISHLIST_MODAL}
        title={text.deleteTitle}
        lead={text.deleteLead(title)}
        keepLabel={text.deleteKeep}
        confirmLabel={text.deleteConfirm}
        loading={deleting}
        onConfirm={() => void remove()}
      />
    </>
  );
}
