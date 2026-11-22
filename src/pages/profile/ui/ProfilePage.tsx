'use client';

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

const settings = [
  {
    key: 'bookings',
    title: 'Показывать счётчик броней',
    hint: 'Только сколько, без имён и подарков',
  },
  {
    key: 'friends',
    title: 'Праздники подруг',
    hint: 'Напоминания за неделю',
  },
  {
    key: 'mail',
    title: 'Письма о новых бронях',
    hint: 'Без спойлеров, что именно',
  },
  {
    key: 'visibility',
    title: 'Кто видит мой профиль',
    hint: 'Все по ссылке',
  },
] as const;

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
  const lists = 0;
  const wishes = 0;
  const received = 0;

  async function leave() {
    setLeaving(true);
    try {
      await authClient.signOut();
    } catch {
      showToast('Нет сети или сервер недоступен.');
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
      showToast('Ссылка скопирована.');
    } catch {
      showToast('Не получилось скопировать.');
    }
  }

  const leaveButton = (className: string) => (
    <Button variant="link" className={`${styles.leave} ${className}`} loading={leaving} onClick={() => void leave()}>
      <span className={styles.leaveIcon} aria-hidden="true" />
      Выйти из аккаунта
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
      showToast('Сохранено.');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.fields) {
        setErrors(error.fields);
      } else if (error instanceof ApiError) {
        showToast(error.message);
      } else {
        showToast('Нет сети или сервер недоступен.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <h1>Профиль</h1>
      <div className={styles.layout}>
        <aside className={`px ${styles.card}`}>
          <span className={`px ${styles.avatar}`} aria-hidden="true">
            {name.trim().slice(0, 1).toUpperCase() || 'М'}
          </span>
          <strong className={styles.cardName}>{name.trim() || 'Мечтатель'}</strong>
          <small className={styles.cardHandle}>{formatHandleLevel(nick)}</small>
          <div className={styles.stats}>
            <span>
              <b>{lists}</b>
              {ruPlural(lists, 'вишлист', 'вишлиста', 'вишлистов')}
            </span>
            <span>
              <b>{wishes}</b>
              {ruPlural(wishes, 'желание', 'желания', 'желаний')}
            </span>
            <span>
              <b>{received}</b>
              {ruPlural(received, 'получено', 'получено', 'получено')}
            </span>
          </div>
          <div className={`px ${styles.linkRow}`}>
            <div className={styles.linkIcon} aria-hidden="true" />
            <div className={styles.linkText}>gifts.app/{nick}</div>
            <button
              className={styles.copy}
              type="button"
              aria-label="Скопировать ссылку"
              onClick={() => void copyLink()}
            >
              <div className={styles.copyIcon} aria-hidden="true" />
            </button>
          </div>
          {leaveButton(styles.leaveDesktop)}
        </aside>

        <form className={styles.form} onSubmit={(event) => void save(event)} noValidate>
          <p className={styles.kicker}>Личные данные</p>
          <div className={styles.fields}>
            <Input
              label="Имя"
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
              label="Ник для ссылки"
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
              label="Почта"
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
              label="День рождения"
              name="birthday"
              value={birthday}
              placeholder="дд.мм"
              error={errors.birthday}
              end={<CalendarIcon className={styles.calendar} />}
              onChange={(event) => {
                setBirthday(event.target.value);
                setErrors((current) => ({ ...current, birthday: undefined }));
              }}
            />
          </div>

          <p className={styles.kicker}>Уведомления и приватность</p>
          <div className={styles.settings}>
            {settings.map((item) => (
              <div key={item.key} className={styles.setting}>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.hint}</small>
                </span>
                <Switch
                  checked={toggles[item.key]}
                  label={item.title}
                  onChange={(checked) => setToggles((value) => ({ ...value, [item.key]: checked }))}
                />
              </div>
            ))}
          </div>

          <Button type="submit" className={styles.save} loading={saving}>
            Сохранить изменения
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
