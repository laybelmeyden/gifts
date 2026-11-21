'use client';

import { PixelHeart } from '@shared/ui';
import { useEffect, useState } from 'react';
import styles from './Dialogue.module.css';

const lines = [
  '* Ты достойна именно тех подарков, о которых мечтаешь.',
  '* Подарок говорит то, что голос стесняется.',
  '* Даже маленький сюрприз может отогреть целый день.',
  '* Не цена делает подарок. Делает взгляд, с которым его отдают.',
];

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
