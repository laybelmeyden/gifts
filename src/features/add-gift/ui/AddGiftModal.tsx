'use client';

import {
  createGiftSchema,
  GIFT_CATEGORIES,
  GIFT_COVERS,
  GIFT_DESIRES,
  type GiftCategory,
  type GiftCover,
  type GiftDesire,
  type GiftDetail,
  updateGiftSchema,
} from '@contracts/gift';
import { t } from '@contracts/i18n';
import { updateGift } from '@entities/gift';
import { ApiError } from '@shared/api';
import { cx, fieldErrors, type FieldErrors } from '@shared/lib';
import { Button, Modal, useModal, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { createGift } from '../api/create-gift';
import styles from './AddGiftModal.module.css';

export const ADD_GIFT_MODAL = 'add-gift';

const text = t.addGift;

type AddGiftModalProps = {
  wishlistId: string;
  /** Если передан, модалка редактирует этот подарок вместо создания нового. */
  gift?: GiftDetail;
};

export function AddGiftModal({ wishlistId, gift }: AddGiftModalProps) {
  return (
    <Modal name={ADD_GIFT_MODAL} title={gift ? t.gift.editTitle : text.title} size="xl" className={styles.dialog}>
      <AddGiftForm wishlistId={wishlistId} gift={gift} />
    </Modal>
  );
}

function AddGiftForm({ wishlistId, gift }: AddGiftModalProps) {
  const router = useRouter();
  const showToast = useToast();
  const { closeModal } = useModal();
  const photoSoonId = useId();
  const [productUrl, setProductUrl] = useState(gift?.productUrl ?? '');
  const [title, setTitle] = useState(gift?.title ?? '');
  const [price, setPrice] = useState(gift?.price ?? '');
  const [category, setCategory] = useState<GiftCategory>(gift?.category ?? 'home');
  const [desire, setDesire] = useState<GiftDesire>(gift?.desire ?? 'want');
  const [comment, setComment] = useState(gift?.comment ?? '');
  const [cover, setCover] = useState<GiftCover>(gift?.cover ?? 'gift');
  const [photo] = useState(gift?.imageUrl ?? '');
  const [usePhoto, setUsePhoto] = useState(!!gift?.imageUrl);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  // На тач-экранах подсказка при наведении не видна, поэтому дублируем её тостом.
  const photoSoon = () => {
    if (matchMedia('(hover: none)').matches) showToast(text.photoSoon);
  };

  function clearError(field: string) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = {
      productUrl,
      title,
      price,
      category,
      desire,
      comment,
      cover,
      photo: usePhoto ? photo : '',
    };
    const parsed = gift ? updateGiftSchema.safeParse(fields) : createGiftSchema.safeParse({ wishlistId, ...fields });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (gift) await updateGift(gift.id, fields);
      else await createGift({ wishlistId, ...fields });
      closeModal();
      showToast(gift ? t.gift.edited : text.saved);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.fields) setErrors(error.fields);
      else showToast(error instanceof ApiError ? error.message : t.common.networkError);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
      <Field label={text.productUrl} error={errors.productUrl}>
        <input
          className={styles.input}
          name="productUrl"
          value={productUrl}
          placeholder={text.productUrlPlaceholder}
          inputMode="url"
          autoComplete="off"
          onChange={(event) => {
            setProductUrl(event.target.value);
            clearError('productUrl');
          }}
        />
        <span className={cx(styles.icon, styles.linkIcon)} aria-hidden="true" />
      </Field>

      <div className={styles.main}>
        <div className={styles.media}>
          <div className={cx('px', styles.preview)}>
            {usePhoto && photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL из выбранного файла, next/image тут не нужен
              <img src={photo} alt="" />
            ) : (
              <span className={cx(styles.coverIcon, styles[cover])} aria-hidden="true" />
            )}
          </div>
          <div className={styles.thumbs}>
            {GIFT_COVERS.map((item) => (
              <button
                key={item}
                className={cx('px', styles.thumb, !usePhoto && cover === item && styles.selected)}
                type="button"
                aria-label={text.covers[item]}
                aria-pressed={!usePhoto && cover === item}
                onClick={() => {
                  setCover(item);
                  setUsePhoto(false);
                }}
              >
                <span className={cx(styles.thumbIcon, styles[item])} aria-hidden="true" />
              </button>
            ))}
            {photo ? (
              <button
                className={cx('px', styles.thumb, usePhoto && styles.selected)}
                type="button"
                aria-label={text.photo}
                aria-pressed={usePhoto}
                onClick={() => setUsePhoto(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL из выбранного файла, next/image тут не нужен */}
                <img src={photo} alt="" />
              </button>
            ) : (
              <span className={styles.soon} data-tip={text.photoSoon}>
                <button
                  className={cx(styles.thumb, styles.addThumb)}
                  type="button"
                  aria-label={`${text.addPhoto}. ${text.photoSoon}`}
                  aria-disabled="true"
                  onClick={photoSoon}
                >
                  <span className={cx(styles.thumbIcon, styles.plus)} aria-hidden="true" />
                </button>
              </span>
            )}
          </div>
          <span className={styles.soon} data-tip={text.photoSoon}>
            <button
              className={cx('px', styles.upload)}
              type="button"
              aria-disabled="true"
              aria-describedby={photoSoonId}
              onClick={photoSoon}
            >
              <span className={cx(styles.icon, styles.camera)} aria-hidden="true" />
              {text.uploadPhoto}
            </button>
            <span id={photoSoonId} hidden>
              {text.photoSoon}
            </span>
          </span>
          {errors.photo && <span className={styles.error}>* {errors.photo}</span>}
        </div>

        <div className={styles.fields}>
          <Field label={text.name} error={errors.title}>
            <input
              className={styles.input}
              name="title"
              value={title}
              placeholder={text.namePlaceholder}
              autoComplete="off"
              autoFocus
              onChange={(event) => {
                setTitle(event.target.value);
                clearError('title');
              }}
            />
          </Field>
          <div className={styles.pair}>
            <Field label={text.price} error={errors.price}>
              <input
                className={styles.input}
                name="price"
                value={price}
                placeholder={text.pricePlaceholder}
                inputMode="decimal"
                autoComplete="off"
                onChange={(event) => {
                  setPrice(event.target.value);
                  clearError('price');
                }}
              />
            </Field>
            <Field label={text.category}>
              <select
                className={cx(styles.input, styles.select)}
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value as GiftCategory)}
              >
                {GIFT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {text.categories[item]}
                  </option>
                ))}
              </select>
              <span className={styles.caret} aria-hidden="true" />
            </Field>
          </div>
          <div className={styles.group} role="radiogroup" aria-label={text.desire}>
            <span className={styles.label}>{text.desire}</span>
            <div className={styles.desires}>
              {GIFT_DESIRES.map((item, index) => (
                <button
                  key={item}
                  className={cx('px', styles.desire, desire === item && styles.desireOn)}
                  type="button"
                  role="radio"
                  aria-checked={desire === item}
                  onClick={() => setDesire(item)}
                >
                  <span className={styles.hearts} aria-hidden="true">
                    {Array.from({ length: index + 1 }, (_, heart) => (
                      <span key={heart} className={styles.heart} />
                    ))}
                  </span>
                  {text.desires[item]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Field label={text.comment} error={errors.comment}>
        <input
          className={styles.input}
          name="comment"
          value={comment}
          placeholder={text.commentPlaceholder}
          autoComplete="off"
          onChange={(event) => {
            setComment(event.target.value);
            clearError('comment');
          }}
        />
      </Field>

      <div className={styles.actions}>
        <Button variant="link" className={styles.cancel} onClick={closeModal}>
          {text.cancel}
        </Button>
        <Button type="submit" variant="pink" className={styles.save} loading={saving}>
          <span className={cx(styles.icon, styles.check)} aria-hidden="true" />
          {gift ? t.gift.editSave : text.save}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  const errorId = useId();
  return (
    <label className={styles.field} aria-describedby={error ? errorId : undefined}>
      <span className={styles.label}>{label}</span>
      <span className={cx('px', styles.control, error && styles.invalid)}>{children}</span>
      {error && (
        <span className={styles.error} id={errorId}>
          * {error}
        </span>
      )}
    </label>
  );
}
