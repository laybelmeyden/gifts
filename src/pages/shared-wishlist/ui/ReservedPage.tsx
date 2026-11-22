'use client';

import { t } from '@contracts/i18n';
import type { SharedGiftDetail } from '@contracts/reservation';
import { formatPrice } from '@entities/gift';
import { CreateWishlistButton } from '@features/create-wishlist';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { ButtonLink } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import styles from './ReservedPage.module.css';

const text = t.reserve;

export function ReservedPage({ gift }: { gift: SharedGiftDetail }) {
  return (
    <section className={styles.page}>
      <HeroScene empty className={styles.scene} />
      <h1 className={styles.title}>{text.doneTitle}</h1>
      <p className={styles.lead}>{text.doneText}</p>

      <div className={cx('px', styles.summary)}>
        <span className={styles.thumb}>
          {gift.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- фото хранится data URL-ом, next/image тут не нужен
            <img src={gift.imageUrl} alt="" />
          ) : (
            <span className={cx(styles.cover, styles[gift.cover])} aria-hidden="true" />
          )}
        </span>
        <span className={styles.giftText}>
          <span className={styles.giftTitle}>{gift.title}</span>
          {gift.price && <span className={styles.price}>{formatPrice(gift.price)}</span>}
        </span>
      </div>

      <div className={styles.actions}>
        <ButtonLink className={styles.action} href={routes.sharedWishlist(gift.wishlistId)}>
          {text.toWishlist}
        </ButtonLink>
        <ButtonLink className={styles.action} variant="secondary" href={routes.giving}>
          <span className={styles.giftIcon} aria-hidden="true" />
          {text.allMine}
        </ButtonLink>
      </div>

      <CreateWishlistButton variant="link" className={styles.create}>
        <span className={styles.plus} aria-hidden="true" />
        {t.shared.createOwn}
      </CreateWishlistButton>
    </section>
  );
}
