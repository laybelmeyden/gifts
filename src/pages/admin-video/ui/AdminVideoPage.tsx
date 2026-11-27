'use client';

import type { AdminWishlist } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { OCCASION_COVERS, WISHLIST_OCCASIONS, type WishlistOccasion } from '@contracts/wishlist';
import { CoverIcon, WishlistCard } from '@entities/wishlist';
import { TILE, WISHLIST_STACK_PAGE_SIZE, routes } from '@shared/config';
import { cx, useFitPageSize, usePaged } from '@shared/lib';
import { FitGrid, Pagination } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import { useRef, useState } from 'react';
import styles from './AdminVideoPage.module.css';

const text = t.video;

type AdminVideoPageProps = {
  lists: AdminWishlist[];
};

export function AdminVideoPage({ lists }: AdminVideoPageProps) {
  const [filter, setFilter] = useState<WishlistOccasion | 'all'>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const { pageSize, columns } = useFitPageSize(gridRef, TILE.wishlist, {
    singleColumnPageSize: WISHLIST_STACK_PAGE_SIZE,
  });
  const occasions = WISHLIST_OCCASIONS.filter((item) => lists.some((list) => list.occasion === item));
  const active = filter !== 'all' && !occasions.includes(filter) ? 'all' : filter;
  const shown = active === 'all' ? lists : lists.filter((list) => list.occasion === active);
  const paged = usePaged(shown, pageSize, active);

  if (!lists.length) {
    return (
      <section className={styles.page}>
        <h1>{text.title}</h1>
        <div className={styles.empty}>
          <HeroScene empty />
          <h2>{text.listsEmpty}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className={cx(styles.page, columns <= 1 && styles.stack)}>
      <h1>{text.title}</h1>
      <div className={styles.filters} role="radiogroup" aria-label={text.filters}>
        <button
          className={cx('px', styles.chip, active === 'all' && styles.chipOn)}
          type="button"
          role="radio"
          aria-checked={active === 'all'}
          onClick={() => setFilter('all')}
        >
          {t.myLists.all}
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
      <FitGrid ready={pageSize != null} flow={columns <= 1} gridRef={gridRef} className={styles.grid}>
        {paged.items.map((list) => (
          <WishlistCard
            key={list.id}
            list={list}
            href={routes.adminWishlistVideo(list.id)}
            detail={list.ownerName.trim() || t.common.defaultName}
          />
        ))}
      </FitGrid>
      <Pagination page={paged.page} pageCount={pageSize == null ? 1 : paged.pageCount} onPage={paged.setPage} />
    </section>
  );
}
