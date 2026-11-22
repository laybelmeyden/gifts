'use client';

import type { GiftCover } from '@contracts/gift';
import { t } from '@contracts/i18n';
import { reserveGiftSchema } from '@contracts/reservation';
import { formatPrice, reserveGift } from '@entities/gift';
import { useSession } from '@entities/session';
import { ApiError } from '@shared/api';
import { routes, withNext } from '@shared/config';
import { cx, fieldErrors, type FieldErrors } from '@shared/lib';
import { Button, Modal, Switch, useModal, useToast } from '@shared/ui';
import { usePathname, useRouter } from 'next/navigation';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import styles from './ReserveGift.module.css';

const text = t.reserve;

type ReservableGift = {
  id: string;
  title: string;
  price: string | null;
  cover: GiftCover;
  imageUrl: string | null;
};

type ReserveGiftProps = {
  gift: ReservableGift;
  wishlistId: string;
  ownerName: string;
  className?: string;
  children: ReactNode;
};

/** Гостя без входа отправляем войти и вернуться сюда же, вошедшему открываем окно брони. */
export function ReserveGift({ gift, wishlistId, ownerName, className, children }: ReserveGiftProps) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModal();
  const modal = `reserve-gift:${gift.id}`;

  function start() {
    if (session.status === 'authenticated') openModal(modal);
    else router.push(withNext(routes.signIn, pathname));
  }

  return (
    <>
      <button className={className} type="button" onClick={start}>
        {children}
      </button>
      <Modal name={modal} title={text.title} size="sm" className={styles.dialog}>
        <ReserveForm gift={gift} wishlistId={wishlistId} ownerName={ownerName} />
      </Modal>
    </>
  );
}

function ReserveForm({ gift, wishlistId, ownerName }: Omit<ReserveGiftProps, 'className' | 'children'>) {
  const session = useSession();
  const router = useRouter();
  const showToast = useToast();
  const { closeModal } = useModal();
  const nameId = useId();
  const [name, setName] = useState(session.user?.name ?? '');
  const [anonymous, setAnonymous] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = reserveGiftSchema.safeParse({ name, anonymous });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await reserveGift(gift.id, parsed.data);
      closeModal();
      router.push(routes.reserved(wishlistId, gift.id));
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        setErrors(error.fields);
      } else {
        showToast(error instanceof ApiError ? error.message : t.common.networkError);
        if (error instanceof ApiError && error.status === 409) {
          closeModal();
          router.refresh();
        }
      }
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
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

      <div className={styles.field}>
        <label className={styles.label} htmlFor={nameId}>
          {text.nameLabel}
        </label>
        <span className={cx('px', styles.control, errors.name && styles.invalid)}>
          <input
            id={nameId}
            className={styles.input}
            value={name}
            placeholder={text.namePlaceholder}
            autoComplete="nickname"
            aria-invalid={errors.name ? true : undefined}
            onChange={(event) => {
              setName(event.target.value);
              setErrors({});
            }}
          />
        </span>
        {errors.name && <span className={styles.error}>* {errors.name}</span>}
      </div>

      <div className={styles.settings}>
        <div className={styles.setting}>
          <span>
            <strong>{text.anonymous}</strong>
            <small>{text.anonymousHint(ownerName)}</small>
          </span>
          <Switch checked={anonymous} label={text.anonymous} onChange={setAnonymous} />
        </div>
        <div className={cx(styles.setting, styles.soon)}>
          <span>
            <strong>{text.remind}</strong>
            <small>{text.remindHint}</small>
          </span>
          <Switch
            checked={false}
            label={`${text.remind}. ${text.remindHint}`}
            onChange={() => showToast(text.remindHint)}
          />
        </div>
      </div>

      <Button type="submit" variant="pink" block className={styles.submit} loading={saving}>
        <span className={styles.giftIcon} aria-hidden="true" />
        {text.submit}
      </Button>
      <p className={styles.note}>{text.note}</p>
    </form>
  );
}
