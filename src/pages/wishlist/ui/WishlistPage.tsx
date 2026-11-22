'use client';

import type { ManagedUser } from '@contracts/admin';
import { GIFT_CATEGORIES, type GiftCategory } from '@contracts/gift';
import { t } from '@contracts/i18n';
import type { WishlistDetail } from '@contracts/wishlist';
import { GiftRow } from '@entities/gift';
import { CoverIcon, coverTone } from '@entities/wishlist';
import { AddGiftButton, AddGiftModal } from '@features/add-gift';
import { WishlistMenu } from '@features/delete-wishlist';
import { ShareWishlist } from '@features/share-wishlist';
import { routes } from '@shared/config';
import { cx, ruPlural } from '@shared/lib';
import { HeroScene } from '@widgets/hero-scene';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import styles from './WishlistPage.module.css';

const text = t.wishlist;

const longDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });

function when(list: WishlistDetail) {
  if (!list.date || list.daysLeft === null) return text.noDate;
  const date = longDate.format(new Date(`${list.date}T00:00:00Z`));
  if (list.daysLeft < 0) return `${date} · ${text.passed}`;
  if (list.daysLeft === 0) return `${date} · ${text.today}`;
  return `${date} · ${text.left(list.daysLeft, ruPlural(list.daysLeft, text.days))}`;
}

type WishlistPageProps = {
  list: WishlistDetail;
  /** Админ открыл вишлист пользователя из админки: все кнопки работают от имени хозяина. */
  managedUser?: ManagedUser;
};

export function WishlistPage({ list, managedUser }: WishlistPageProps) {
  const [filter, setFilter] = useState<GiftCategory | 'all'>('all');
  const listsHref = managedUser ? routes.adminLists(managedUser.id) : routes.myList;
  const giftHref = (giftId: string) =>
    managedUser ? routes.adminGift(managedUser.id, list.id, giftId) : routes.gift(list.id, giftId);

  const categories = GIFT_CATEGORIES.map((category) => ({
    category,
    count: list.gifts.filter((gift) => gift.category === category).length,
  })).filter((item) => item.count > 0);
  const active = filter !== 'all' && !categories.some((item) => item.category === filter) ? 'all' : filter;
  const shown = active === 'all' ? list.gifts : list.gifts.filter((gift) => gift.category === active);

  const total = list.gifts.length;
  const booked = Math.min(list.bookedCount, total);

  return (
    <section className={styles.page}>
      <nav className={styles.crumbs} aria-label={text.breadcrumbs}>
        <Link className={styles.back} href={listsHref}>
          <span className={styles.arrow} aria-hidden="true" />
          <span className={styles.backText}>{managedUser ? t.admin.userLists(managedUser.name) : text.back}</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className={styles.current}>{list.title}</span>
      </nav>

      <header className={styles.head}>
        <span className={cx('px', styles.cover)} style={{ '--tone': coverTone[list.cover] } as CSSProperties}>
          <CoverIcon cover={list.cover} className={styles.coverIcon} />
        </span>
        <div className={styles.heading}>
          <h1>{list.title}</h1>
          <p className={styles.meta}>
            {when(list)}
            <span className={styles.seen}>{text.seenBy[list.visibility]}</span>
          </p>
        </div>
        <div className={styles.actions}>
          <ShareWishlist list={list} ownerName={managedUser?.name} className={cx('px', styles.share)}>
            <span className={cx(styles.icon, styles.shareIcon)} aria-hidden="true" />
            {text.share}
          </ShareWishlist>
          <AddGiftButton className={styles.add} variant="pink">
            <span className={styles.plus} aria-hidden="true" />
            {text.addGift}
          </AddGiftButton>
          <WishlistMenu wishlistId={list.id} title={list.title} redirectTo={listsHref} />
        </div>
      </header>

      {total > 0 ? (
        <>
          <div className={cx('px', styles.progress)}>
            <div className={styles.progressMain}>
              <div className={styles.progressHead}>
                <span className={styles.booked}>
                  <span className={styles.heart} aria-hidden="true" />
                  {text.booked}
                </span>
                <span>{text.bookedCount(booked, total)}</span>
              </div>
              <span className={cx('px', styles.bar)}>
                <span className={styles.fill} style={{ width: `${(booked / total) * 100}%` }} />
              </span>
            </div>
            <p className={styles.secret}>
              <span className={cx(styles.icon, styles.eyeIcon)} aria-hidden="true" />
              {text.secret}
            </p>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.filters} role="radiogroup" aria-label={text.filters}>
              <button
                className={cx('px', styles.chip, active === 'all' && styles.chipOn)}
                type="button"
                role="radio"
                aria-checked={active === 'all'}
                onClick={() => setFilter('all')}
              >
                {text.all} · {total}
              </button>
              {categories.map(({ category, count }) => (
                <button
                  key={category}
                  className={cx('px', styles.chip, active === category && styles.chipOn)}
                  type="button"
                  role="radio"
                  aria-checked={active === category}
                  onClick={() => setFilter(category)}
                >
                  {t.addGift.categories[category]} · {count}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {shown.map((gift) => (
              <GiftRow key={gift.id} gift={gift} href={giftHref(gift.id)} />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <HeroScene empty />
          <h2>{text.emptyTitle}</h2>
          <p>{text.emptyText}</p>
          <AddGiftButton>
            <span className={styles.emptyPlus} aria-hidden="true" />
            {text.addGift}
          </AddGiftButton>
        </div>
      )}

      <AddGiftModal wishlistId={list.id} />
    </section>
  );
}
