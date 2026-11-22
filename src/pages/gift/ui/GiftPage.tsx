'use client';

import type { ManagedUser } from '@contracts/admin';
import { GIFT_DESIRES, type GiftDetail } from '@contracts/gift';
import { t } from '@contracts/i18n';
import { formatPrice, shopName } from '@entities/gift';
import { ADD_GIFT_MODAL, AddGiftModal } from '@features/add-gift';
import { ChangePhotoButton, DeleteGift, ReceivedButton } from '@features/manage-gift';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { useModal } from '@shared/ui';
import Link from 'next/link';
import styles from './GiftPage.module.css';

const text = t.gift;

type GiftPageProps = {
  gift: GiftDetail;
  /** Админ открыл подарок пользователя из админки: все кнопки работают от имени хозяина. */
  managedUser?: ManagedUser;
};

export function GiftPage({ gift, managedUser }: GiftPageProps) {
  const { openModal } = useModal();
  const shop = shopName(gift.productUrl);
  const level = GIFT_DESIRES.indexOf(gift.desire) + 1;
  const wishlistHref = managedUser
    ? routes.adminWishlist(managedUser.id, gift.wishlistId)
    : routes.wishlist(gift.wishlistId);

  return (
    <section className={styles.page}>
      <nav className={styles.crumbs} aria-label={t.wishlist.breadcrumbs}>
        <Link className={styles.back} href={wishlistHref}>
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
          <ChangePhotoButton className={styles.changePhoto} />
        </div>

        <div className={styles.info}>
          <div className={styles.tags}>
            <span className={styles.tag}>{t.addGift.categories[gift.category]}</span>
            <span className={cx(styles.tag, styles.desire)}>
              <span className={styles.hearts} aria-hidden="true">
                {GIFT_DESIRES.map((item, index) => (
                  <span key={item} className={cx(styles.pip, index < level && styles.pipOn)} />
                ))}
              </span>
              {t.addGift.desires[gift.desire]}
            </span>
            {gift.received && <span className={cx(styles.tag, styles.receivedTag)}>{text.received}</span>}
          </div>

          <h1 className={styles.title}>{gift.title}</h1>
          {gift.price && <p className={styles.price}>{formatPrice(gift.price)}</p>}

          {gift.productUrl && (
            <a className={cx('px', styles.open)} href={gift.productUrl} target="_blank" rel="noreferrer">
              <span className={cx(styles.icon, styles.linkIcon)} aria-hidden="true" />
              {shop ? text.open(shop) : text.openLink}
            </a>
          )}

          {gift.comment && (
            <div className={cx('px', styles.comment)}>
              <span className={styles.label}>{text.comment}</span>
              <p>* {gift.comment}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button className={cx('px', styles.edit)} type="button" onClick={() => openModal(ADD_GIFT_MODAL)}>
              <span className={cx(styles.icon, styles.pencil)} aria-hidden="true" />
              {text.edit}
            </button>
            <ReceivedButton giftId={gift.id} received={gift.received} />
            <DeleteGift giftId={gift.id} title={gift.title} redirectTo={wishlistHref} />
          </div>

          <p className={styles.hint}>
            <span className={cx(styles.icon, styles.eyeIcon)} aria-hidden="true" />* {text.hint}
          </p>
        </div>
      </div>

      <AddGiftModal wishlistId={gift.wishlistId} gift={gift} />
    </section>
  );
}
