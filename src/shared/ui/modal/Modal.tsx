'use client';

import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib';
import { useModal } from '../ui-context/UiProvider';
import styles from './Modal.module.css';

type ModalProps = {
  /** Ключ модалки в UiProvider: открыта, когда activeModal совпадает с name. */
  name: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export function Modal({ name, title, className, children }: ModalProps) {
  const { activeModal, closeModal } = useModal();
  const titleId = useId();
  if (activeModal !== name) return null;

  return createPortal(
    <div className={styles.modal}>
      <button className={styles.backdrop} type="button" tabIndex={-1} aria-label="Закрыть" onClick={closeModal} />
      <div className={styles.glow}>
        <div className={cx('px', styles.card, className)} role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <header className={styles.head}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button className={cx('px', styles.close)} type="button" aria-label="Закрыть" onClick={closeModal}>
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
              </svg>
            </button>
          </header>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
