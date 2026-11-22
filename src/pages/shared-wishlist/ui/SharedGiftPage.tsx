'use client';

import { GIFT_DESIRES } from '@contracts/gift';
import { t } from '@contracts/i18n';
import type { SharedGift, SharedGiftDetail } from '@contracts/reservation';
import { formatPrice, GiftCard, shopName } from '@entities/gift';
import { CancelReservation, ReserveGift } from '@features/reserve-gift';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { useToast } from '@shared/ui';
import Link from 'next/link';
import { GuestBar } from './GuestBar';
import styles from './SharedGiftPage.module.css';

const text = t.shared;

type SharedGiftPageProps = {
  gift: SharedGiftDetail;
  /** Другие подарки этого вишлиста для блока «Ещё из вишлиста». */
  more: SharedGift[];
  /** Гость без входа: страница без сайдбара, сверху лого. */
  standalone?: boolean;
};

export function SharedGiftPage({ gift, more, standalone = false }: SharedGiftPageProps) {
  const showToast = useToast();
  const shop = shopName(gift.productUrl);
  const level = GIFT_DESIRES.indexOf(gift.desire) + 1;
  const hint = {
    free: text.hint(gift.ownerName),
    mine: text.hintMine,
    booked: text.hintBooked,
    received: text.hintReceived,
  }[gift.status];

  // На тач-экранах подсказка при наведении не видна, поэтому дублируем её тостом.
  const chipInSoon = () => {
    if (matchMedia('(hover: none)').matches) showToast(text.soon);
  };

  return (
    <section className={cx(styles.page, standalone && styles.standalone)}>
      {standalone && <GuestBar />}

      <nav className={styles.crumbs} aria-label={t.wishlist.breadcrumbs}>
        <Link className={styles.back} href={routes.sharedWishlist(gift.wishlistId)}>
          <span className={styles.arrow} aria-hidden="true" />
          <span className={styles.backText}>{gift.wishlistTitle}</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className={styles.current}>{gift.title}</span>
      </nav>

      <div className={styles.layout}>
        <div className={cx('px', styles.preview)}>
          {gift.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- фото хранится data URL-ом, next/image тут не нужен
            <img src={gift.imageUrl} alt="" />
          ) : (
            <span className={cx(styles.cover, styles[gift.cover])} aria-hidden="true" />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.tags}>
            <span className={cx(styles.tag, styles[gift.status])}>{text.status[gift.status]}</span>
            <span className={cx(styles.tag, styles.desire)}>
              <span className={styles.hearts} aria-hidden="true">
                {GIFT_DESIRES.map((item, index) => (
                  <span key={item} className={cx(styles.pip, index < level && styles.pipOn)} />
                ))}
              </span>
              {t.addGift.desires[gift.desire]}
            </span>
          </div>

          <h1 className={styles.title}>{gift.title}</h1>

          {(gift.price || gift.productUrl) && (
            <div className={styles.priceRow}>
              {gift.price && <p className={styles.price}>{formatPrice(gift.price)}</p>}
              {gift.productUrl && (
                <a className={styles.open} href={gift.productUrl} target="_blank" rel="noreferrer">
                  <span className={cx(styles.icon, styles.linkIcon)} aria-hidden="true" />
                  {shop ? t.gift.open(shop) : t.gift.openLink}
                </a>
              )}
            </div>
          )}

          {gift.comment && (
            <p className={cx('px', styles.comment)}>
              <span className={styles.heart} aria-hidden="true" />
              <span>
                * {gift.ownerName}: {gift.comment}
              </span>
            </p>
          )}

          {gift.status === 'free' && (
            <div className={styles.actions}>
              <ReserveGift
                gift={gift}
                wishlistId={gift.wishlistId}
                ownerName={gift.ownerName}
                className={cx('px', styles.action, styles.reserve)}
              >
                <span className={cx(styles.icon, styles.giftIcon)} aria-hidden="true" />
                {text.reserve}
              </ReserveGift>
              <span className={styles.soon} data-tip={text.soon}>
                <button
                  className={cx('px', styles.action, styles.chipIn)}
                  type="button"
                  aria-disabled="true"
                  onClick={chipInSoon}
                >
                  <span className={cx(styles.icon, styles.friendsIcon)} aria-hidden="true" />
                  {text.chipIn}
                </button>
              </span>
            </div>
          )}

          {gift.status === 'mine' && (
            <div className={styles.actions}>
              <CancelReservation
                giftId={gift.id}
                title={gift.title}
                ownerName={gift.ownerName}
                className={cx('px', styles.action, styles.chipIn)}
              >
                {text.cancel}
              </CancelReservation>
            </div>
          )}

          <p className={styles.hint}>
            <span className={cx(styles.icon, styles.lockIcon)} aria-hidden="true" />
            {hint}
          </p>
        </div>
      </div>

      {more.length > 0 && (
        <section className={styles.more}>
          <h2>{text.more}</h2>
          <div className={styles.grid}>
            {more.map((item) => (
              <GiftCard
                key={item.id}
                gift={item}
                href={routes.sharedGift(gift.wishlistId, item.id)}
                action={
                  <ReserveGift
                    gift={item}
                    wishlistId={gift.wishlistId}
                    ownerName={gift.ownerName}
                    className={styles.give}
                  >
                    {text.give}
                  </ReserveGift>
                }
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
