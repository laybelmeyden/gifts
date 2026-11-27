'use client';

import { t } from '@contracts/i18n';
import type { WishlistDetail } from '@contracts/wishlist';
import { ExportWishlistVideo } from '@features/export-wishlist-video';
import { routes } from '@shared/config';
import Link from 'next/link';
import styles from './WishlistVideoPage.module.css';

const text = t.video;

type WishlistVideoPageProps = {
  list: WishlistDetail;
  host: string;
};

export function WishlistVideoPage({ list, host }: WishlistVideoPageProps) {
  return (
    <section className={styles.page}>
      <nav className={styles.crumbs} aria-label={text.breadcrumbs}>
        <Link className={styles.back} href={routes.adminVideo}>
          <span className={styles.arrow} aria-hidden="true" />
          <span className={styles.backText}>{text.back}</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className={styles.current}>{list.title}</span>
      </nav>
      <h1>{text.title}</h1>
      <ExportWishlistVideo list={list} host={host} />
    </section>
  );
}
