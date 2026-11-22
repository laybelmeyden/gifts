'use client';

import { t } from '@contracts/i18n';
import { useSession } from '@entities/session';
import { routes } from '@shared/config';
import { formatHandleLevel, nickFromName } from '@shared/lib';
import { Logo, SoonButton, useToast } from '@shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import styles from './AppShell.module.css';

const nav = [
  { href: routes.myList, label: t.nav.myLists, icon: 'list' },
  { label: t.nav.friends, icon: 'friends' },
  { label: t.nav.giving, icon: 'gift' },
  { label: t.nav.calendar, icon: 'calendar' },
  { href: routes.profile, label: t.nav.profile, icon: 'user' },
] as const;

const tabs = [
  { href: routes.myList, label: t.nav.tabs.lists, icon: 'list' },
  { label: t.nav.tabs.friends, icon: 'friends' },
  'create',
  { label: t.nav.tabs.giving, icon: 'gift' },
  { href: routes.profile, label: t.nav.tabs.profile, icon: 'user' },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const showToast = useToast();
  const pathname = usePathname();
  const user = session.status === 'authenticated' ? session.user : null;
  const name = user?.name?.trim() || t.common.defaultName;
  const handle = user ? formatHandleLevel(user.handle || nickFromName(name)) : '';
  const later = () => showToast(t.common.soon);

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Logo className={styles.brand} href={routes.myList} />
        <nav className={styles.nav} aria-label={t.nav.label}>
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
          {t.nav.newList}
        </SoonButton>
        <div className={styles.me}>
          <Link className={`px ${styles.avatar}`} href={routes.profile} aria-label={t.nav.profile}>
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
      <nav className={styles.tabs} aria-label={t.nav.label}>
        {tabs.map((item) => {
          if (item === 'create') {
            return (
              <button key={item} className={styles.tabCreate} type="button" aria-label={t.nav.newList} onClick={later}>
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
