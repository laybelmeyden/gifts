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

const staffNav: NavItem[] = [
  { href: routes.admin, label: t.nav.admin, icon: 'admin' },
  { href: routes.adminVideo, label: t.nav.video, icon: 'video' },
];

function pathActive(pathname: string | null, href?: string) {
  return !!href && (pathname === href || !!pathname?.startsWith(`${href}/`));
}

function tabCaption(item: NavItem) {
  return item.key ? t.nav.tabs[item.key] : item.label;
}

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
  const [moreOpen, setMoreOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setMoreOpen(false);
  }
  const user = session.status === 'authenticated' ? session.user : null;
  const isAdmin = user?.role === 'admin';
  const name = user?.name?.trim() || t.common.defaultName;
  const handle = user ? formatHandleLevel(user.handle || nickFromName(name)) : '';
  const later = () => showToast(t.common.soon);
  const isHidden = (key?: NavKey) => !!key && (overrides[key] ?? hiddenNav.includes(key));
  const shown = (item: NavItem) => isAdmin || !isHidden(item.key);
  const items = isAdmin ? [...nav, ...staffNav] : nav.filter(shown);
  const extraNav = [
    ...nav.filter((item) => (item.key === 'friends' || item.key === 'calendar') && shown(item)),
    ...(isAdmin ? staffNav : []),
  ];
  const tabByKey = (key: NavKey) => nav.find((item) => item.key === key && shown(item)) ?? null;
  const tabBar: (NavItem | 'create' | 'more' | null)[] = [
    tabByKey('lists'),
    tabByKey('giving'),
    'create',
    tabByKey('profile'),
    extraNav.length > 0 ? 'more' : null,
  ];
  const moreActive = extraNav.some((item) => pathActive(pathname, item.href));
  const setVisible = (key: NavKey, visible: boolean) => setOverrides((current) => ({ ...current, [key]: !visible }));

  function navControl(item: NavItem, className: string, label: string, onPick?: () => void, withCount = false) {
    const content = (
      <>
        <span className={`${styles.icon} ${styles[item.icon]}`} aria-hidden="true" />
        {label}
        {withCount && !!item.key && !!counts[item.key] && <span className={styles.count}>{counts[item.key]}</span>}
      </>
    );
    if (item.href) {
      return (
        <Link className={className} href={item.href} onClick={onPick}>
          {content}
        </Link>
      );
    }
    return (
      <button
        className={className}
        type="button"
        onClick={() => {
          onPick?.();
          later();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Logo className={styles.brand} href={routes.myList} />
        <nav className={styles.nav} aria-label={t.nav.label}>
          {items.map((item) => {
            const active = pathActive(pathname, item.href);
            const className = cx(
              active && 'px',
              styles.item,
              active && styles.active,
              isHidden(item.key) && styles.muted,
              isAdmin && item.key && styles.withEye,
            );
            return (
              <div key={item.label} className={styles.navRow}>
                {navControl(item, className, item.label, undefined, true)}
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
        <div className={styles.dock}>
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
      {moreOpen && (
        <button
          className={styles.moreBackdrop}
          type="button"
          aria-label={t.common.close}
          onClick={() => setMoreOpen(false)}
        />
      )}
      <nav className={styles.tabs} aria-label={t.nav.label}>
        {moreOpen && extraNav.length > 0 && (
          <div className={cx('px', styles.moreSheet)} role="menu" aria-label={t.nav.tabs.more}>
            {extraNav.map((item) => {
              const active = pathActive(pathname, item.href);
              return (
                <div key={item.label} role="none">
                  {navControl(
                    item,
                    cx(styles.moreItem, active && styles.moreItemActive, isHidden(item.key) && styles.muted),
                    item.label,
                    () => setMoreOpen(false),
                  )}
                </div>
              );
            })}
          </div>
        )}
        {tabBar.map((item, index) => {
          if (item === null) {
            return <span key={`empty-${index}`} className={styles.tabEmpty} />;
          }
          if (item === 'create') {
            return (
              <span key={item} className={styles.tabSlot}>
                <button
                  className={styles.tabCreate}
                  type="button"
                  aria-label={t.nav.newList}
                  onClick={() => openModal(CREATE_WISHLIST_MODAL)}
                >
                  <span className={styles.tabPlus} aria-hidden="true" />
                </button>
              </span>
            );
          }
          if (item === 'more') {
            return (
              <span key={item} className={styles.tabSlot}>
                <button
                  className={cx(styles.tab, (moreOpen || moreActive) && styles.tabActive)}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="menu"
                  onClick={() => setMoreOpen((open) => !open)}
                >
                  <span className={`${styles.icon} ${styles.more}`} aria-hidden="true" />
                  {t.nav.tabs.more}
                </button>
              </span>
            );
          }
          const active = pathActive(pathname, item.href);
          return (
            <span key={item.label} className={styles.tabSlot}>
              {navControl(item, cx(styles.tab, active && styles.tabActive), tabCaption(item))}
            </span>
          );
        })}
      </nav>
      <CreateWishlistModal />
    </div>
  );
}
