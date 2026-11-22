'use client';

import type { ReactNode } from 'react';
import { cx } from '../../lib';
import { Button } from '../button/Button';
import { Modal } from '../modal/Modal';
import { useModal } from '../ui-context/UiProvider';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  /** Ключ модалки в UiProvider. */
  name: string;
  title: string;
  lead: ReactNode;
  keepLabel: string;
  confirmLabel: string;
  /** `danger` - красная кнопка с корзиной (удаление), `soft` - розовая без иконки (отмена брони и т.п.). */
  tone?: 'danger' | 'soft';
  loading?: boolean;
  onConfirm: () => void;
};

/** Подтверждение необратимого действия: «Оставить» закрывает окно, правая кнопка подтверждает. */
export function ConfirmModal({
  name,
  title,
  lead,
  keepLabel,
  confirmLabel,
  tone = 'danger',
  loading,
  onConfirm,
}: ConfirmModalProps) {
  const { closeModal } = useModal();

  return (
    <Modal name={name} title={title} size="sm" className={styles.dialog}>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.confirm}>
        <Button variant="secondary" className={styles.keep} onClick={closeModal}>
          {keepLabel}
        </Button>
        <Button
          variant={tone === 'soft' ? 'pink' : 'primary'}
          className={cx(styles.remove, styles[tone])}
          loading={loading}
          onClick={onConfirm}
        >
          {tone === 'danger' && <span className={styles.trash} aria-hidden="true" />}
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
