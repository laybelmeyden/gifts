'use client';

import { t } from '@contracts/i18n';
import { cx } from '@shared/lib';
import { useToast } from '@shared/ui';
import { useId } from 'react';
import styles from './ManageGift.module.css';

export function ChangePhotoButton({ className }: { className?: string }) {
  const showToast = useToast();
  const soonId = useId();

  // На тач-экранах подсказка при наведении не видна, поэтому дублируем её тостом.
  const photoSoon = () => {
    if (matchMedia('(hover: none)').matches) showToast(t.addGift.photoSoon);
  };

  return (
    <span className={cx(styles.soon, className)} data-tip={t.addGift.photoSoon}>
      <button
        className={cx('px', styles.photo)}
        type="button"
        aria-disabled="true"
        aria-describedby={soonId}
        onClick={photoSoon}
      >
        <span className={cx(styles.icon, styles.camera)} aria-hidden="true" />
        {t.gift.changePhoto}
      </button>
      <span id={soonId} hidden>
        {t.addGift.photoSoon}
      </span>
    </span>
  );
}
