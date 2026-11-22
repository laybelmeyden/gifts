'use client';

import { t } from '@contracts/i18n';
import {
  createWishlistSchema,
  OCCASION_COVERS,
  WISHLIST_COVERS,
  WISHLIST_OCCASIONS,
  WISHLIST_VISIBILITIES,
  type WishlistCover,
  type WishlistOccasion,
  type WishlistVisibility,
} from '@contracts/wishlist';
import { CoverIcon, coverTone } from '@entities/wishlist';
import { ApiError } from '@shared/api';
import { cx, fieldErrors, type FieldErrors } from '@shared/lib';
import { Button, Modal, useModal, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createWishlist } from '../api/create-wishlist';
import { fromIsoDate, maskDate, toIsoDate } from '../lib/date';
import styles from './CreateWishlistModal.module.css';

export const CREATE_WISHLIST_MODAL = 'create-wishlist';

const text = t.createWishlist;

const visibilityIcon: Record<WishlistVisibility, string | undefined> = {
  link: styles.linkIcon,
  friends: styles.friendsIcon,
  private: styles.lockIcon,
};

export function CreateWishlistModal() {
  return (
    <Modal name={CREATE_WISHLIST_MODAL} title={text.title} size="lg" className={styles.dialog}>
      <CreateWishlistForm />
    </Modal>
  );
}

function CreateWishlistForm() {
  const router = useRouter();
  const showToast = useToast();
  const { closeModal } = useModal();
  const titleErrorId = useId();
  const visibilitySoonId = useId();
  const pickerRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [occasion, setOccasion] = useState<WishlistOccasion>('birthday');
  const [date, setDate] = useState('');
  const [cover, setCover] = useState<WishlistCover>(OCCASION_COVERS.birthday);
  const [visibility, setVisibility] = useState<WishlistVisibility>('link');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  function pickOccasion(next: WishlistOccasion) {
    if (!title.trim() || title === text.occasions[occasion]) setTitle(text.occasions[next]);
    setOccasion(next);
    setCover(OCCASION_COVERS[next]);
    setErrors((current) => ({ ...current, title: undefined }));
  }

  // На тач-экранах подсказка при наведении не видна, поэтому дублируем её тостом.
  const visibilitySoon = () => {
    if (matchMedia('(hover: none)').matches) showToast(text.visibilitySoon);
  };

  function changeDate(next: string) {
    setDate(next);
    setErrors((current) => ({ ...current, date: undefined }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createWishlistSchema.safeParse({
      title,
      occasion,
      date: date ? (toIsoDate(date) ?? date) : '',
      cover,
      visibility,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await createWishlist(parsed.data);
      closeModal();
      showToast(text.saved);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.fields) setErrors(error.fields);
      else showToast(error instanceof ApiError ? error.message : t.common.networkError);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
      <label className={styles.field}>
        <span className={styles.label}>{text.name}</span>
        <span className={cx('px', styles.control, errors.title && styles.invalid)}>
          <input
            className={styles.input}
            name="title"
            value={title}
            placeholder={text.namePlaceholder}
            autoComplete="off"
            autoFocus
            aria-describedby={errors.title ? titleErrorId : undefined}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrors((current) => ({ ...current, title: undefined }));
            }}
          />
        </span>
        {errors.title && (
          <span className={styles.error} id={titleErrorId}>
            * {errors.title}
          </span>
        )}
      </label>

      <div className={styles.field} role="radiogroup" aria-label={text.occasion}>
        <span className={styles.label}>{text.occasion}</span>
        <div className={styles.chips}>
          {WISHLIST_OCCASIONS.map((item) => (
            <button
              key={item}
              className={cx('px', styles.chip, occasion === item && styles.chipOn)}
              type="button"
              role="radio"
              aria-checked={occasion === item}
              onClick={() => pickOccasion(item)}
            >
              <CoverIcon cover={OCCASION_COVERS[item]} />
              {text.occasions[item]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>{text.date}</span>
          <span className={cx('px', styles.control, errors.date && styles.invalid)}>
            <input
              className={styles.input}
              name="date"
              value={date}
              placeholder={text.datePlaceholder}
              inputMode="numeric"
              autoComplete="off"
              onChange={(event) => changeDate(maskDate(event.target.value))}
            />
            <button
              className={styles.calendar}
              type="button"
              aria-label={text.pickDate}
              onClick={() => pickerRef.current?.showPicker()}
            />
            <input
              ref={pickerRef}
              className={styles.picker}
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              value={toIsoDate(date) ?? ''}
              onChange={(event) => changeDate(fromIsoDate(event.target.value))}
            />
          </span>
          {errors.date && <span className={styles.error}>* {errors.date}</span>}
        </label>

        <div className={styles.field} role="radiogroup" aria-label={text.cover}>
          <span className={styles.label}>{text.cover}</span>
          <div className={styles.covers}>
            {WISHLIST_COVERS.map((item) => (
              <button
                key={item}
                className={cx('px', styles.cover, cover === item && styles.coverOn)}
                style={{ '--tone': coverTone[item] } as CSSProperties}
                type="button"
                role="radio"
                aria-checked={cover === item}
                aria-label={text.covers[item]}
                onClick={() => setCover(item)}
              >
                <CoverIcon cover={item} className={styles.coverIcon} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.field} role="radiogroup" aria-label={text.visibility}>
        <span className={styles.label}>{text.visibility}</span>
        <div className={styles.access}>
          {WISHLIST_VISIBILITIES.map((item) => {
            const option = (
              <button
                key={item}
                className={cx('px', styles.option, visibility === item && styles.optionOn)}
                type="button"
                role="radio"
                aria-checked={visibility === item}
                aria-disabled={item === 'link' ? undefined : true}
                aria-describedby={item === 'link' ? undefined : visibilitySoonId}
                onClick={() => (item === 'link' ? setVisibility(item) : visibilitySoon())}
              >
                <span className={cx(styles.optionIcon, visibilityIcon[item])} aria-hidden="true" />
                <strong>{text.visibilities[item].title}</strong>
                <small>{text.visibilities[item].hint}</small>
              </button>
            );
            return item === 'link' ? (
              option
            ) : (
              <span key={item} className={styles.soon} data-tip={text.visibilitySoon}>
                {option}
              </span>
            );
          })}
        </div>
        <span id={visibilitySoonId} hidden>
          {text.visibilitySoon}
        </span>
      </div>

      <div className={styles.actions}>
        <Button variant="link" className={styles.cancel} onClick={closeModal}>
          {text.cancel}
        </Button>
        <Button type="submit" className={styles.save} loading={saving}>
          <span className={styles.check} aria-hidden="true" />
          {text.save}
        </Button>
      </div>
    </form>
  );
}
