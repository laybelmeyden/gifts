'use client';

import { t } from '@contracts/i18n';
import type { SharedGift, SharedWishlist } from '@contracts/reservation';
import { GiftCard, priceValue } from '@entities/gift';
import { ReserveGift } from '@features/reserve-gift';
import { TILE, WISHLIST_STACK_PAGE_SIZE, routes } from '@shared/config';
import { cx, ruPlural, useFitPageSize, usePaged } from '@shared/lib';
import { FitGrid, Pagination } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import { useRef, useState } from 'react';
import { GuestBar } from './GuestBar';
import styles from './SharedWishlistPage.module.css';

const text = t.shared;

const CHEAP_MAX = 3000;
const FILTERS = ['all', 'free', 'cheap'] as const;
type Filter = (typeof FILTERS)[number];

const matches: Record<Filter, (gift: SharedGift) => boolean> = {
  all: () => true,
  free: (gift) => gift.status === 'free',
  cheap: (gift) => {
    const value = priceValue(gift.price);
    return value !== null && value <= CHEAP_MAX;
  },
};

const longDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });

type SharedWishlistPageProps = {
  list: SharedWishlist;
  /** Гость без входа: страница без сайдбара, сверху лого. */
  standalone?: boolean;
};

export function SharedWishlistPage({ list, standalone = false }: SharedWishlistPageProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const { pageSize, columns } = useFitPageSize(gridRef, TILE.giftCard, {
    singleColumnPageSize: WISHLIST_STACK_PAGE_SIZE,
  });
  const shown = list.gifts.filter(matches[filter]);
  const paged = usePaged(shown, pageSize, filter);
  const total = list.gifts.length;
  const free = list.gifts.filter(matches.free).length;
  const occasion = t.createWishlist.occasions[list.occasion];
  const date = list.date ? longDate.format(new Date(`${list.date}T00:00:00Z`)) : null;
  const daysLeft = list.daysLeft !== null && list.daysLeft >= 0 ? list.daysLeft : null;

  return (
    <section className={cx(styles.page, standalone && styles.standalone, columns <= 1 && styles.stack)}>
      {standalone && <GuestBar />}

      <header className={cx('px', styles.hero)}>
        <span className={cx('px', styles.avatar)} aria-hidden="true">
          {list.ownerName.trim().slice(0, 1).toUpperCase() || '♥'}
        </span>
        <div className={styles.heading}>
          <h1>{list.title}</h1>
          <p>{date ? `${occasion} · ${date}` : occasion}</p>
        </div>
        <dl className={styles.stats}>
          {daysLeft !== null && (
            <div className={cx(styles.stat, styles.days)}>
              <dt>{ruPlural(daysLeft, text.stats.days)}</dt>
              <dd>{daysLeft}</dd>
            </div>
          )}
          <div className={cx(styles.stat, styles.wishes)}>
            <dt>{ruPlural(total, text.stats.wishes)}</dt>
            <dd>{total}</dd>
          </div>
          <div className={cx(styles.stat, styles.free)}>
            <dt>{text.stats.free}</dt>
            <dd>{free}</dd>
          </div>
        </dl>
      </header>

      {total > 0 ? (
        <>
          <div className={styles.toolbar}>
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
                  {text[item]}
                </button>
              ))}
            </div>
            <p className={cx('px', styles.tip)}>
              <span className={styles.heart} aria-hidden="true" />* {text.tip}
            </p>
          </div>

          {shown.length > 0 ? (
            <>
              <FitGrid ready={pageSize != null} flow={columns <= 1} gridRef={gridRef} className={styles.grid}>
                {paged.items.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    href={routes.sharedGift(list.id, gift.id)}
                    action={
                      <ReserveGift gift={gift} wishlistId={list.id} ownerName={list.ownerName} className={styles.give}>
                        {text.give}
                      </ReserveGift>
                    }
                  />
                ))}
              </FitGrid>
              <Pagination page={paged.page} pageCount={pageSize == null ? 1 : paged.pageCount} onPage={paged.setPage} />
            </>
          ) : (
            <p className={styles.nothing}>{text.nothing}</p>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <HeroScene empty />
          <h2>{t.wishlist.emptyTitle}</h2>
          <p>{t.wishlist.guestEmptyText}</p>
        </div>
      )}
    </section>
  );
}
