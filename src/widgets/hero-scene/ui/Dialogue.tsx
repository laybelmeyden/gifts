'use client';

import { t } from '@contracts/i18n';
import { PixelHeart } from '@shared/ui';
import { useEffect, useState } from 'react';
import styles from './Dialogue.module.css';

const lines = t.home.quotes;

export function Dialogue() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % lines.length);
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <button
      className={`px ${styles.box}`}
      type="button"
      onClick={() => setIndex((value) => (value + 1) % lines.length)}
    >
      <PixelHeart color="red" className={styles.heart} />
      <span>{lines[index]}</span>
      <span className={styles.more} aria-hidden="true">
        ▾
      </span>
    </button>
  );
}
