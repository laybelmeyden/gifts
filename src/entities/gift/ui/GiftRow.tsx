import { GIFT_DESIRES, type OwnerGift } from '@contracts/gift';
import { t } from '@contracts/i18n';
import { cx } from '@shared/lib';
import Link from 'next/link';
import { bookingLabel } from '../lib/booking-label';
import { formatPrice } from '../lib/format-price';
import { shopName } from '../lib/shop-name';
import styles from './GiftRow.module.css';

export function GiftRow({ gift, href }: { gift: OwnerGift; href: string }) {
  const shop = shopName(gift.productUrl);
  const level = GIFT_DESIRES.indexOf(gift.desire) + 1;
  const booked = !gift.received && !!gift.booking;

  return (
    <Link className={cx('px', styles.row, gift.received && styles.received, booked && styles.booked)} href={href}>
      <span className={styles.body}>
        <span className={cx('px', styles.thumb)}>
          {gift.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- фото хранится data URL-ом, next/image тут не нужен
            <img src={gift.imageUrl} alt="" />
          ) : (
            <span className={cx(styles.cover, styles[gift.cover])} aria-hidden="true" />
          )}
        </span>
        <span className={styles.info}>
          <span className={styles.title}>{gift.title}</span>
          {(gift.price || shop) && (
            <span className={styles.line}>
              {gift.price && <span className={styles.price}>{formatPrice(gift.price)}</span>}
              {shop && <span className={styles.shop}>{shop}</span>}
            </span>
          )}
          <span className={styles.hearts} role="img" aria-label={t.wishlist.desire(t.addGift.desires[gift.desire])}>
            {GIFT_DESIRES.map((item, index) => (
              <span key={item} className={cx(styles.pip, index < level && styles.pipOn)} />
            ))}
          </span>
        </span>
      </span>
      {gift.received && <span className={styles.badge}>{t.gift.received}</span>}
      {booked && gift.booking && (
        <span className={cx(styles.badge, styles.bookedBadge)}>
          <span className={styles.bookedHeart} aria-hidden="true" />
          {bookingLabel(gift.booking)}
        </span>
      )}
    </Link>
  );
}
