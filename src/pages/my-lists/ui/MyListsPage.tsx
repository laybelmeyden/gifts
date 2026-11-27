'use client';

import type { ManagedUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { OCCASION_COVERS, WISHLIST_OCCASIONS, type WishlistOccasion, type WishlistSummary } from '@contracts/wishlist';
import { CoverIcon, WishlistCard } from '@entities/wishlist';
import { TILE, WISHLIST_STACK_PAGE_SIZE, routes } from '@shared/config';
import { cx, useFitPageSize, usePaged } from '@shared/lib';
import { FitGrid, Pagination } from '@shared/ui';
import { useRef, useState } from 'react';
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
  const gridRef = useRef<HTMLDivElement>(null);
  const { pageSize, columns } = useFitPageSize(gridRef, TILE.wishlist, {
    singleColumnPageSize: WISHLIST_STACK_PAGE_SIZE,
  });

  const occasions = WISHLIST_OCCASIONS.filter((item) => lists.some((list) => list.occasion === item));
  const active = filter !== 'all' && !occasions.includes(filter) ? 'all' : filter;
  const shown = active === 'all' ? lists : lists.filter((list) => list.occasion === active);
  const paged = usePaged(shown, pageSize, active);

  if (!lists.length) return <EmptyLists name={name} managedUser={managedUser} />;

  const first = name.trim().split(/\s+/)[0] || t.common.defaultName;

  return (
    <section className={cx(styles.page, columns <= 1 && styles.stack)}>
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
      <FitGrid ready={pageSize != null} flow={columns <= 1} gridRef={gridRef} className={styles.grid}>
        {paged.items.map((list) => (
          <WishlistCard
            key={list.id}
            list={list}
            href={managedUser ? routes.adminWishlist(managedUser.id, list.id) : undefined}
          />
        ))}
      </FitGrid>
      <Pagination page={paged.page} pageCount={pageSize == null ? 1 : paged.pageCount} onPage={paged.setPage} />
    </section>
  );
}
