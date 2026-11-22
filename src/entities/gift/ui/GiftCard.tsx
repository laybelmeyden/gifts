import { t } from '@contracts/i18n';
import type { SharedGift } from '@contracts/reservation';
import { cx } from '@shared/lib';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatPrice } from '../lib/format-price';
import styles from './GiftCard.module.css';

type GiftCardProps = {
  gift: SharedGift;
  href: string;
  /** Кнопка для свободного подарка; у занятого вместо неё плашка статуса. */
  action?: ReactNode;
};

export function GiftCard({ gift, href, action }: GiftCardProps) {
  const taken = gift.status === 'booked' || gift.status === 'received';

  return (
    <article className={cx('px', styles.card, taken && styles.taken, styles[gift.status])}>
      <Link className={styles.link} href={href}>
        <span className={styles.thumb}>
          {gift.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- фото хранится data URL-ом, next/image тут не нужен
            <img src={gift.imageUrl} alt="" />
          ) : (
            <span className={cx(styles.cover, styles[gift.cover])} aria-hidden="true" />
          )}
        </span>
        <span className={styles.info}>
          <span className={styles.title}>{gift.title}</span>
          {gift.price && <span className={styles.price}>{formatPrice(gift.price)}</span>}
        </span>
      </Link>
      <div className={styles.footer}>
        {gift.status === 'free' ? (
          action
        ) : (
          <span className={styles.badge}>
            {t.shared.status[gift.status]}
            {gift.status !== 'received' && <span className={styles.heart} aria-hidden="true" />}
          </span>
        )}
      </div>
    </article>
  );
}
