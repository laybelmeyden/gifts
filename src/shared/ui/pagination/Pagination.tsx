'use client';

import { t } from '@contracts/i18n';
import { cx } from '../../lib';
import styles from './Pagination.module.css';

type PaginationProps = {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
};

function pagesAround(page: number, pageCount: number) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

export function Pagination({ page, pageCount, onPage }: PaginationProps) {
  if (pageCount <= 1) return <div className={styles.pager} aria-hidden="true" />;

  return (
    <nav className={styles.pager} aria-label={t.common.pager}>
      <button
        className={cx('px', styles.btn)}
        type="button"
        aria-label={t.common.prevPage}
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        <span className={styles.arrow} aria-hidden="true" />
      </button>
      {pagesAround(page, pageCount).map((item) => (
        <button
          key={item}
          className={cx('px', styles.btn, item === page && styles.on)}
          type="button"
          aria-label={t.common.page(item)}
          aria-current={item === page ? 'page' : undefined}
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}
      <button
        className={cx('px', styles.btn)}
        type="button"
        aria-label={t.common.nextPage}
        disabled={page >= pageCount}
        onClick={() => onPage(page + 1)}
      >
        <span className={cx(styles.arrow, styles.next)} aria-hidden="true" />
      </button>
    </nav>
  );
}
