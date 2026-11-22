'use client';

import type { ManagedUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { OCCASION_COVERS, WISHLIST_OCCASIONS, type WishlistOccasion, type WishlistSummary } from '@contracts/wishlist';
import { CoverIcon, WishlistCard } from '@entities/wishlist';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { useState } from 'react';
import { EmptyLists } from './EmptyLists';
import styles from './MyListsPage.module.css';

const text = t.myLists;

type MyListsPageProps = {
  name: string;
  lists: WishlistSummary[];
  /** Админ смотрит вишлисты пользователя из админки. */
  managedUser?: ManagedUser;
};

export function MyListsPage({ name, lists, managedUser }: MyListsPageProps) {
  const [filter, setFilter] = useState<WishlistOccasion | 'all'>('all');

  const occasions = WISHLIST_OCCASIONS.filter((item) => lists.some((list) => list.occasion === item));
  const active = filter !== 'all' && !occasions.includes(filter) ? 'all' : filter;
  const shown = active === 'all' ? lists : lists.filter((list) => list.occasion === active);

  if (!lists.length) return <EmptyLists name={name} managedUser={managedUser} />;

  const first = name.trim().split(/\s+/)[0] || t.common.defaultName;

  return (
    <section className={styles.page}>
      <h1>{managedUser ? t.admin.userLists(managedUser.name) : text.greeting(first)}</h1>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="radiogroup" aria-label={text.filters}>
          <button
            className={cx('px', styles.chip, active === 'all' && styles.chipOn)}
            type="button"
            role="radio"
            aria-checked={active === 'all'}
            onClick={() => setFilter('all')}
          >
            {text.all}
          </button>
          {occasions.map((item) => (
            <button
              key={item}
              className={cx('px', styles.chip, active === item && styles.chipOn)}
              type="button"
              role="radio"
              aria-checked={active === item}
              onClick={() => setFilter(item)}
            >
              <CoverIcon cover={OCCASION_COVERS[item]} />
              {t.createWishlist.occasions[item]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        {shown.map((list) => (
          <WishlistCard
            key={list.id}
            list={list}
            href={managedUser ? routes.adminWishlist(managedUser.id, list.id) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
