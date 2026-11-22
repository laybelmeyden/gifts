'use client';

import { t } from '@contracts/i18n';
import { updateProfileSchema } from '@contracts/profile';
import { updateProfile } from '@features/edit-profile';
import { authClient, ApiError } from '@shared/api';
import { routes } from '@shared/config';
import { fieldErrors, formatHandleLevel, nickFromName, ruPlural, type FieldErrors } from '@shared/lib';
import { Button, Input, Switch, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import styles from './ProfilePage.module.css';

type ProfilePageProps = {
  name: string;
  email: string;
  handle: string | null;
  birthday: string | null;
};

const text = t.profile;
const settingKeys = ['bookings', 'friends', 'mail', 'visibility'] as const;

export function ProfilePage({
  name: initialName,
  email: initialEmail,
  handle: initialHandle,
  birthday: initialBirthday,
}: ProfilePageProps) {
  const router = useRouter();
  const showToast = useToast();
  const [leaving, setLeaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(initialHandle ?? nickFromName(initialName));
  const [email, setEmail] = useState(initialEmail);
  const [birthday, setBirthday] = useState(initialBirthday ?? '');
  const [toggles, setToggles] = useState({
    bookings: true,
    friends: true,
    mail: false,
    visibility: true,
  });
  const nick = handle.trim() || nickFromName(name);
  const displayName = name.trim() || t.common.defaultName;
  const lists = 0;
  const wishes = 0;
  const received = 0;

  async function leave() {
    setLeaving(true);
    try {
      await authClient.signOut();
    } catch {
      showToast(t.common.networkError);
      setLeaving(false);
      return;
    }
    router.replace(routes.home);
    router.refresh();
  }

  async function copyLink() {
    const url = `gifts-plum-mu.vercel.app/${nick}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(text.linkCopied);
    } catch {
      showToast(text.copyFailed);
    }
  }

  const leaveButton = (className: string) => (
    <Button variant="link" className={`${styles.leave} ${className}`} loading={leaving} onClick={() => void leave()}>
      <span className={styles.leaveIcon} aria-hidden="true" />
      {text.signOut}
    </Button>
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = updateProfileSchema.safeParse({
      name,
      handle,
      email,
      birthday,
    });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const saved = await updateProfile(parsed.data);
      setName(saved.name);
      setHandle(saved.handle ?? parsed.data.handle);
      setEmail(saved.email);
      setBirthday(saved.birthday ?? '');
      showToast(text.saved);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        setErrors(error.fields);
      } else if (error instanceof ApiError) {
        showToast(error.message);
      } else {
        showToast(t.common.networkError);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <h1>{text.title}</h1>
      <div className={styles.layout}>
        <aside className={`px ${styles.card}`}>
          <span className={`px ${styles.avatar}`} aria-hidden="true">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
          <strong className={styles.cardName}>{displayName}</strong>
          <small className={styles.cardHandle}>{formatHandleLevel(nick)}</small>
          <div className={styles.stats}>
            <span>
              <b>{lists}</b>
              {ruPlural(lists, text.stats.lists)}
            </span>
            <span>
              <b>{wishes}</b>
              {ruPlural(wishes, text.stats.wishes)}
            </span>
            <span>
              <b>{received}</b>
              {ruPlural(received, text.stats.received)}
            </span>
          </div>
          <div className={`px ${styles.linkRow}`}>
            <div className={styles.linkIcon} aria-hidden="true" />
            <div className={styles.linkText}>gifts.app/{nick}</div>
            <button
              className={styles.copy}
              type="button"
              aria-label={text.copyLink}
              onClick={() => void copyLink()}
            >
              <div className={styles.copyIcon} aria-hidden="true" />
            </button>
          </div>
          {leaveButton(styles.leaveDesktop)}
        </aside>

        <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
          <p className={styles.kicker}>{text.personal}</p>
          <div className={styles.fields}>
            <Input
              label={t.fields.name}
              name="name"
              value={name}
              autoComplete="name"
              error={errors.name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
            />
            <Input
              label={t.fields.handle}
              name="handle"
              value={handle}
              autoComplete="username"
              error={errors.handle}
              onChange={(event) => {
                setHandle(event.target.value);
                setErrors((current) => ({ ...current, handle: undefined }));
              }}
            />
            <Input
              label={t.fields.email}
              name="email"
              type="email"
              value={email}
              autoComplete="email"
              error={errors.email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
            />
            <Input
              label={t.fields.birthday}
              name="birthday"
              value={birthday}
              placeholder={t.fields.birthdayPlaceholder}
              error={errors.birthday}
              end={<CalendarIcon className={styles.calendar} />}
              onChange={(event) => {
                setBirthday(event.target.value);
                setErrors((current) => ({ ...current, birthday: undefined }));
              }}
            />
          </div>

          <p className={styles.kicker}>{text.settingsTitle}</p>
          <div className={styles.settings}>
            {settingKeys.map((key) => (
              <div key={key} className={styles.setting}>
                <span>
                  <strong>{text.settings[key].title}</strong>
                  <small>{text.settings[key].hint}</small>
                </span>
                <Switch
                  checked={toggles[key]}
                  label={text.settings[key].title}
                  onChange={(checked) => setToggles((value) => ({ ...value, [key]: checked }))}
                />
              </div>
            ))}
          </div>

          <Button type="submit" className={styles.save} loading={saving}>
            {text.save}
          </Button>
        </form>
        {leaveButton(styles.leaveMobile)}
      </div>
    </section>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7h12M5 2v3M11 2v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
