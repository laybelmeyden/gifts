import { t } from '@contracts/i18n';
import type { WishlistSummary } from '@contracts/wishlist';
import { routes } from '@shared/config';
import { cx, ruPlural } from '@shared/lib';
import Link from 'next/link';
import { CoverIcon } from './CoverIcon';
import { coverTone } from './cover-tone';
import styles from './WishlistCard.module.css';

const SOON_DAYS = 14;

const text = t.myLists;

function badge(daysLeft: number | null) {
  if (daysLeft === null) return { label: text.noDate, tone: styles.none };
  if (daysLeft < 0) return { label: text.passed, tone: styles.none };
  if (daysLeft === 0) return { label: text.today, tone: styles.soon };
  return { label: text.inDays(daysLeft), tone: daysLeft <= SOON_DAYS ? styles.soon : styles.later };
}

function shortDate(date: string) {
  const [, month, day] = date.split('-');
  return `${day}.${month}`;
}

export function WishlistCard({ list, href = routes.wishlist(list.id) }: { list: WishlistSummary; href?: string }) {
  const status = badge(list.daysLeft);
  const meta = [`${list.giftCount} ${ruPlural(list.giftCount, text.gifts)}`];
  if (list.date) meta.push(shortDate(list.date));

  return (
    <Link className={cx('px', styles.card)} href={href}>
      <div className={styles.cover} style={{ background: coverTone[list.cover] }}>
        <CoverIcon cover={list.cover} className={styles.coverIcon} />
      </div>
      <div className={styles.body}>
        <span className={cx(styles.badge, status.tone)}>{status.label}</span>
        <h3 className={styles.title}>{list.title}</h3>
        <p className={styles.meta}>{meta.join(' · ')}</p>
      </div>
    </Link>
  );
}
