'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib';
import { Panel } from '../panel/Panel';
import { useModal } from '../ui-context/UiProvider';
import styles from './Modal.module.css';

type ModalProps = {
  /** Ключ модалки в UiProvider: открыта, когда activeModal совпадает с name. */
  name: string;
  label: string;
  className?: string;
  children: ReactNode;
};

export function Modal({ name, label, className, children }: ModalProps) {
  const { activeModal, closeModal } = useModal();
  if (activeModal !== name) return null;

  return createPortal(
    <div className={styles.modal}>
      <button className={styles.backdrop} type="button" aria-label="Закрыть" onClick={closeModal} />
      <Panel className={cx(styles.card, className)} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </Panel>
    </div>,
    document.body,
  );
}
