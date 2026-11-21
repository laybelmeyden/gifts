'use client';

import { useSession } from '@entities/session';
import { authClient } from '@shared/api';
import { routes } from '@shared/config';
import { Button, Logo, SoonButton, useToast } from '@shared/ui';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import styles from './AppShell.module.css';

const later = ['Подруги', 'Я дарю', 'Календарь', 'Профиль'] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const showToast = useToast();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const user = session.status === 'authenticated' ? session.user : null;
  const name = user?.name?.trim() || 'Мечтатель';
  const handle = user ? `@${user.email.split('@')[0]}` : '';

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Logo />
        <nav className={styles.nav} aria-label="Разделы">
          <a className={`px ${styles.item} ${styles.active}`} href={routes.myList}>
            Мои вишлисты
          </a>
          {later.map((label) => (
            <button key={label} className={styles.item} type="button" onClick={() => showToast('Это появится следующим шагом.')}>
              {label}
            </button>
          ))}
        </nav>
        <SoonButton className={styles.create} variant="pink">
          + Новый вишлист
        </SoonButton>
        <div className={styles.me}>
          <span className={`px ${styles.avatar}`} aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{name}</strong>
            <small>{handle}</small>
            <Button variant="link" className={styles.leave} loading={leaving} onClick={() => void leave()}>
              Выйти
            </Button>
          </span>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.mobileBar}>
          <Logo />
          <Button variant="link" className={styles.leave} loading={leaving} onClick={() => void leave()}>
            Выйти
          </Button>
        </header>
        {children}
      </div>
      <nav className={styles.tabs} aria-label="Разделы">
        <a className={styles.tabActive} href={routes.myList}>
          Вишлисты
        </a>
        {['Подруги', 'Я дарю', 'Профиль'].map((label) => (
          <button key={label} type="button" onClick={() => showToast('Это появится следующим шагом.')}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

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
}
