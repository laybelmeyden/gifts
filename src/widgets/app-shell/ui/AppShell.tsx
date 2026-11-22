'use client';

import { t } from '@contracts/i18n';
import type { NavCounts, NavKey } from '@contracts/nav';
import { useSession } from '@entities/session';
import { CREATE_WISHLIST_MODAL, CreateWishlistButton, CreateWishlistModal } from '@features/create-wishlist';
import { NavVisibilityToggle } from '@features/toggle-nav-visibility';
import { routes } from '@shared/config';
import { cx, formatHandleLevel, nickFromName } from '@shared/lib';
import { Logo, useModal, useToast } from '@shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import styles from './AppShell.module.css';

type NavItem = { key?: NavKey; href?: string; label: string; icon: string };

const nav: NavItem[] = [
  { key: 'lists', href: routes.myList, label: t.nav.myLists, icon: 'list' },
  { key: 'friends', label: t.nav.friends, icon: 'friends' },
  { key: 'giving', href: routes.giving, label: t.nav.giving, icon: 'gift' },
  { key: 'calendar', label: t.nav.calendar, icon: 'calendar' },
  { key: 'profile', href: routes.profile, label: t.nav.profile, icon: 'user' },
];

const adminItem: NavItem = { href: routes.admin, label: t.nav.admin, icon: 'admin' };

const tabs: (NavItem | 'create')[] = [
  { key: 'lists', href: routes.myList, label: t.nav.tabs.lists, icon: 'list' },
  { key: 'friends', label: t.nav.tabs.friends, icon: 'friends' },
  'create',
  { key: 'giving', href: routes.giving, label: t.nav.tabs.giving, icon: 'gift' },
  { key: 'profile', href: routes.profile, label: t.nav.tabs.profile, icon: 'user' },
];

type AppShellProps = {
  hiddenNav: NavKey[];
  counts: NavCounts;
  children: ReactNode;
};

export function AppShell({ hiddenNav, counts, children }: AppShellProps) {
  const session = useSession();
  const showToast = useToast();
  const { openModal } = useModal();
  const pathname = usePathname();
  const [overrides, setOverrides] = useState<Partial<Record<NavKey, boolean>>>({});
  const user = session.status === 'authenticated' ? session.user : null;
  const isAdmin = user?.role === 'admin';
  const name = user?.name?.trim() || t.common.defaultName;
  const handle = user ? formatHandleLevel(user.handle || nickFromName(name)) : '';
  const later = () => showToast(t.common.soon);
  const isHidden = (key?: NavKey) => !!key && (overrides[key] ?? hiddenNav.includes(key));
  const shown = (item: NavItem) => isAdmin || !isHidden(item.key);
  const items = isAdmin ? [...nav, adminItem] : nav.filter(shown);
  const visibleTabs = tabs.filter((item) => item === 'create' || shown(item));
  const setVisible = (key: NavKey, visible: boolean) => setOverrides((current) => ({ ...current, [key]: !visible }));

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Logo className={styles.brand} href={routes.myList} />
        <nav className={styles.nav} aria-label={t.nav.label}>
          {items.map((item) => {
            const active = !!item.href && (pathname === item.href || pathname?.startsWith(`${item.href}/`));
            const className = cx(
              active && 'px',
              styles.item,
              active && styles.active,
              isHidden(item.key) && styles.muted,
              isAdmin && item.key && styles.withEye,
            );
            const count = item.key ? counts[item.key] : undefined;
            const content = (
              <>
                <span className={`${styles.icon} ${styles[item.icon]}`} aria-hidden="true" />
                {item.label}
                {!!count && <span className={styles.count}>{count}</span>}
              </>
            );
            const link = item.href ? (
              <Link className={className} href={item.href}>
                {content}
              </Link>
            ) : (
              <button className={className} type="button" onClick={later}>
                {content}
              </button>
            );
            return (
              <div key={item.label} className={styles.navRow}>
                {link}
                {isAdmin && item.key && (
                  <NavVisibilityToggle
                    className={styles.eye}
                    navKey={item.key}
                    label={item.label}
                    visible={!isHidden(item.key)}
                    onChange={setVisible}
                  />
                )}
              </div>
            );
          })}
        </nav>
        <CreateWishlistButton className={styles.create} variant="pink">
          <span className={styles.plus} aria-hidden="true" />
          {t.nav.newList}
        </CreateWishlistButton>
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
      <nav
        className={styles.tabs}
        style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))` }}
        aria-label={t.nav.label}
      >
        {visibleTabs.map((item) => {
          if (item === 'create') {
            return (
              <button
                key={item}
                className={styles.tabCreate}
                type="button"
                aria-label={t.nav.newList}
                onClick={() => openModal(CREATE_WISHLIST_MODAL)}
              >
                <span className={styles.tabPlus} aria-hidden="true" />
              </button>
            );
          }
          const active = !!item.href && pathname === item.href;
          const className = cx(styles.tab, active && styles.tabActive, isHidden(item.key) && styles.muted);
          const content = (
            <>
              <span className={`${styles.icon} ${styles[item.icon]}`} aria-hidden="true" />
              {item.label}
            </>
          );
          return item.href ? (
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
      <CreateWishlistModal />
    </div>
  );
}
