'use client';

import { t } from '@contracts/i18n';
import type { WishlistDetail } from '@contracts/wishlist';
import { useSession } from '@entities/session';
import { CoverIcon, coverTone } from '@entities/wishlist';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { Modal, PixelHeart, useModal, useToast } from '@shared/ui';
import type { CSSProperties, ReactNode } from 'react';
import styles from './ShareWishlist.module.css';

const SHARE_WISHLIST_MODAL = 'share-wishlist';

const text = t.share;

const shortDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'UTC' });

type ShareWishlistProps = {
  list: WishlistDetail;
  /** Имя хозяина для открытки, если делится не он сам (админ из админки). */
  ownerName?: string;
  className?: string;
  children: ReactNode;
};

function shareUrl(wishlistId: string) {
  return `${location.origin}${routes.sharedWishlist(wishlistId)}`;
}

function useCopyLink() {
  const showToast = useToast();
  return async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(text.copied);
    } catch {
      showToast(text.copyFailed);
    }
  };
}

export function ShareWishlist({ list, ownerName, className, children }: ShareWishlistProps) {
  const { openModal } = useModal();

  return (
    <>
      <button className={className} type="button" onClick={() => openModal(SHARE_WISHLIST_MODAL)}>
        {children}
      </button>
      <Modal name={SHARE_WISHLIST_MODAL} title={text.title} className={styles.dialog}>
        <ShareContent list={list} ownerName={ownerName} />
      </Modal>
    </>
  );
}

function ShareContent({ list, ownerName }: { list: WishlistDetail; ownerName?: string }) {
  const session = useSession();
  const showToast = useToast();
  const copyLink = useCopyLink();
  const url = shareUrl(list.id);
  const name = (ownerName ?? session.user?.name)?.trim() || t.common.defaultName;
  const invite = text.invite[list.occasion](name);
  const date = list.date ? shortDate.format(new Date(`${list.date}T00:00:00Z`)) : null;

  // На тач-экранах подсказка при наведении не видна, поэтому дублируем её тостом.
  const soon = () => {
    if (matchMedia('(hover: none)').matches) showToast(text.soon);
  };

  function shareMore() {
    if (navigator.share) {
      navigator.share({ title: list.title, text: invite, url }).catch(() => undefined);
    } else {
      showToast(text.soon);
    }
  }

  return (
    <>
      <div className={cx('px', styles.link)}>
        <span className={cx(styles.icon, styles.linkIcon)} aria-hidden="true" />
        <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
        <button className={cx('px', styles.copy)} type="button" onClick={() => void copyLink(url)}>
          <span className={cx(styles.icon, styles.copyIcon)} aria-hidden="true" />
          {text.copy}
        </button>
      </div>

      <div className={styles.channels}>
        <a
          className={cx('px', styles.channel)}
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(invite)}`}
          target="_blank"
          rel="noreferrer"
        >
          <TelegramIcon />
          {text.telegram}
        </a>
        <a
          className={cx('px', styles.channel)}
          href={`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(list.title)}`}
          target="_blank"
          rel="noreferrer"
        >
          <b className={styles.vk} aria-hidden="true">
            VK
          </b>
          {text.vk}
        </a>
        <span className={styles.soon} data-tip={text.soon}>
          <button className={cx('px', styles.channel)} type="button" aria-disabled="true" onClick={soon}>
            <QrIcon />
            {text.qr}
          </button>
        </span>
        <button className={cx('px', styles.channel)} type="button" onClick={shareMore}>
          <span className={styles.dots} aria-hidden="true" />
          {text.more}
        </button>
      </div>

      <p className={styles.kicker}>{text.card}</p>
      <div className={cx('px', styles.card)}>
        <span className={cx('px', styles.cover)} style={{ '--tone': coverTone[list.cover] } as CSSProperties}>
          <CoverIcon cover={list.cover} className={styles.coverIcon} />
        </span>
        <span className={styles.cardText}>
          <strong>{invite}</strong>
          <small>
            {date ? `${date} · ${text.inside}` : text.inside}
            <PixelHeart className={styles.heart} color="red" />
          </small>
        </span>
      </div>

      <span className={styles.soon} data-tip={text.soon}>
        <button className={cx('px', styles.download)} type="button" aria-disabled="true" onClick={soon}>
          <span className={cx(styles.icon, styles.giftIcon)} aria-hidden="true" />
          {text.download}
        </button>
      </span>
    </>
  );
}

function TelegramIcon() {
  return (
    <svg className={styles.svg} viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M0 5h2V4h2V3h2V2h2V1h2V0h2v2h-1v2h-1v2H9v2H8v2H7v2H6v-2H5V9H4V8H2V7H0z" fill="currentColor" />
      <path d="M5 7h1V6h1V5h1v1H7v1H6v1H5z" fill="var(--raised)" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg className={styles.svg} viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      <path
        d="M0 0h5v5H0zm1 1v3h3V1zm6-1h5v5H7zm1 1v3h3V1zM0 7h5v5H0zm1 1v3h3V8zm1-6h1v1H2zm7 0h1v1H9zM2 9h1v1H2zm5-2h2v2H7zm3 0h2v1h-2zm-1 2h1v1H9zm2 0h1v3h-1zm-4 2h3v1H7z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
