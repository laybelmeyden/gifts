'use client';

import { useSession } from '@entities/session';
import { routes } from '@shared/config';
import { formatHandleLevel, nickFromName } from '@shared/lib';
import { Logo, SoonButton, useToast } from '@shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import styles from './AppShell.module.css';

const nav = [
  { href: routes.myList, label: 'Мои вишлисты', icon: 'list' },
  { label: 'Друзья', icon: 'friends' },
  { label: 'Я дарю', icon: 'gift' },
  { label: 'Календарь', icon: 'calendar' },
  { href: routes.profile, label: 'Профиль', icon: 'user' },
] as const;

const tabs = [
  { href: routes.myList, label: 'Вишлисты', icon: 'list' },
  { label: 'Подруги', icon: 'friends' },
  'create',
  { label: 'Я дарю', icon: 'gift' },
  { href: routes.profile, label: 'Профиль', icon: 'user' },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const showToast = useToast();
  const pathname = usePathname();
  const user = session.status === 'authenticated' ? session.user : null;
  const name = user?.name?.trim() || 'Мечтатель';
  const handle = user ? formatHandleLevel(user.handle || nickFromName(name)) : '';
  const later = () => showToast('Это появится следующим шагом.');

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Logo className={styles.brand} href={routes.myList} />
        <nav className={styles.nav} aria-label="Разделы">
          {nav.map((item) => {
            const active = 'href' in item && pathname === item.href;
            const className = active ? `px ${styles.item} ${styles.active}` : styles.item;
            const icon = <span className={`${styles.icon} ${styles[item.icon]}`} aria-hidden="true" />;
            return 'href' in item ? (
              <Link key={item.label} className={className} href={item.href}>
                {icon}
                {item.label}
              </Link>
            ) : (
              <button key={item.label} className={className} type="button" onClick={later}>
                {icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <SoonButton className={styles.create} variant="pink">
          <span className={styles.plus} aria-hidden="true" />
          Новый вишлист
        </SoonButton>
        <div className={styles.me}>
          <Link className={`px ${styles.avatar}`} href={routes.profile} aria-label="Профиль">
            {name.slice(0, 1).toUpperCase()}
          </Link>
          <span className={styles.who}>
            <strong>{name}</strong>
            <small>{handle}</small>
          </span>
        </div>
      </aside>
      <div className={`${styles.main} starfield`}>
        {pathname !== routes.profile && (
          <header className={styles.mobileBar}>
            <Logo href={routes.myList} />
          </header>
        )}
        {children}
      </div>
      <nav className={styles.tabs} aria-label="Разделы">
        {tabs.map((item) => {
          if (item === 'create') {
            return (
              <button key={item} className={styles.tabCreate} type="button" aria-label="Новый вишлист" onClick={later}>
                <span className={styles.tabPlus} aria-hidden="true" />
              </button>
            );
          }
          const active = 'href' in item && pathname === item.href;
          const className = active ? `${styles.tab} ${styles.tabActive}` : styles.tab;
          const content = (
            <>
              <span className={`${styles.icon} ${styles[item.icon]}`} aria-hidden="true" />
              {item.label}
            </>
          );
          return 'href' in item ? (
            <Link key={item.label} className={className} href={item.href} aria-current={active ? 'page' : undefined}>
              {content}
            </Link>
          ) : (
            <button key={item.label} className={className} type="button" onClick={later}>
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
