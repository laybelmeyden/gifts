'use client';

import { t } from '@contracts/i18n';
import type { GivingGift } from '@contracts/reservation';
import { formatPrice, priceValue } from '@entities/gift';
import { CancelReservation, PurchasedButton } from '@features/reserve-gift';
import { routes } from '@shared/config';
import { cx, ruPlural } from '@shared/lib';
import { HeroScene } from '@widgets/hero-scene';
import Link from 'next/link';
import { useState } from 'react';
import styles from './GivingPage.module.css';

const text = t.giving;

const FILTERS = ['all', 'toBuy', 'bought'] as const;
type Filter = (typeof FILTERS)[number];

const isDone = (gift: GivingGift) => gift.purchased || gift.received;

const matches: Record<Filter, (gift: GivingGift) => boolean> = {
  all: () => true,
  toBuy: (gift) => !isDone(gift),
  bought: isDone,
};

const longDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });

type Group = { key: string; label: string; gifts: GivingGift[] };

/** Сервер уже отсортировал по дате праздника, поэтому подарки одного вишлиста идут подряд. */
function groupByWishlist(gifts: GivingGift[]): Group[] {
  const groups: Group[] = [];
  for (const gift of gifts) {
    const last = groups.at(-1);
    if (last?.key === gift.wishlistId) {
      last.gifts.push(gift);
      continue;
    }
    const date = gift.date ? longDate.format(new Date(`${gift.date}T00:00:00Z`)) : text.noDate;
    groups.push({ key: gift.wishlistId, label: `${date} · ${gift.ownerName}`, gifts: [gift] });
  }
  return groups;
}

export function GivingPage({ gifts }: { gifts: GivingGift[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  if (gifts.length === 0) {
    return (
      <section className={cx(styles.page, styles.emptyPage)}>
        <HeroScene empty />
        <h1>{text.emptyTitle}</h1>
        <p>{text.emptyText}</p>
      </section>
    );
  }

  const sum = gifts.reduce((total, gift) => total + (priceValue(gift.price) ?? 0), 0);
  const upcoming = gifts
    .filter((gift) => !gift.received && gift.daysLeft !== null && gift.daysLeft >= 0)
    .map((gift) => gift.daysLeft as number);
  const nearest = upcoming.length > 0 ? Math.min(...upcoming) : null;
  const bought = gifts.filter(isDone).length;
  const groups = groupByWishlist(gifts.filter(matches[filter]));

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <h1>{text.title}</h1>
        <p>{text.lead}</p>
      </header>

      <dl className={styles.stats}>
        <div className={cx(styles.stat, styles.planned)}>
          <dt>{ruPlural(gifts.length, text.stats.planned)}</dt>
          <dd>{gifts.length}</dd>
        </div>
        <div className={cx(styles.stat, styles.sum)}>
          <dt>{text.stats.total}</dt>
          <dd>{formatPrice(String(Math.round(sum)))}</dd>
        </div>
        <div className={cx(styles.stat, styles.days)}>
          <dt>{nearest === null ? text.stats.noDays : text.stats.nearest}</dt>
          <dd>{nearest === null ? '—' : `${nearest} ${ruPlural(nearest, text.stats.days)}`}</dd>
        </div>
        <div className={cx(styles.stat, styles.bought)}>
          <dt>{text.stats.purchased}</dt>
          <dd>{bought}</dd>
        </div>
      </dl>

      <div className={styles.filters} role="radiogroup" aria-label={text.filters}>
        {FILTERS.map((item) => (
          <button
            key={item}
            className={cx('px', styles.chip, filter === item && styles.chipOn)}
            type="button"
            role="radio"
            aria-checked={filter === item}
            onClick={() => setFilter(item)}
          >
            {text[item]} · {gifts.filter(matches[item]).length}
          </button>
        ))}
      </div>

      {groups.length === 0 && <p className={styles.nothing}>{text.nothing}</p>}

      {groups.map((group) => (
        <section key={group.key} className={styles.group}>
          <h2 className={styles.groupTitle}>
            <span className={styles.calendar} aria-hidden="true" />
            {group.label}
          </h2>
          <ul className={styles.list}>
            {group.gifts.map((gift) => (
              <GivingRow key={gift.giftId} gift={gift} />
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

function GivingRow({ gift }: { gift: GivingGift }) {
  const done = isDone(gift);

  return (
    <li className={cx('px', styles.row, done ? styles.done : styles.active)}>
      <Link className={styles.main} href={routes.sharedGift(gift.wishlistId, gift.giftId)}>
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

      <div className={styles.side}>
        {gift.received ? (
          <span className={styles.badge}>
            <span className={styles.check} aria-hidden="true" />
            {text.received}
          </span>
        ) : gift.purchased ? (
          <PurchasedButton giftId={gift.giftId} purchased className={styles.badge}>
            <span className={styles.check} aria-hidden="true" />
            {text.purchased}
          </PurchasedButton>
        ) : (
          <>
            <PurchasedButton giftId={gift.giftId} purchased={false} className={cx('px', styles.action, styles.buy)}>
              <span className={styles.check} aria-hidden="true" />
              {text.markPurchased}
            </PurchasedButton>
            <CancelReservation
              giftId={gift.giftId}
              title={gift.title}
              ownerName={gift.ownerName}
              className={cx('px', styles.action, styles.cancel)}
            >
              {text.cancel}
            </CancelReservation>
          </>
        )}
      </div>
    </li>
  );
}
