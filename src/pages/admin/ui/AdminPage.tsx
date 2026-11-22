'use client';

import type { AdminGift, AdminUser } from '@contracts/admin';
import { t } from '@contracts/i18n';
import { formatPrice } from '@entities/gift';
import { EDIT_USER_MODAL, EditUserModal, type EditUserField } from '@features/edit-user';
import { RESET_PASSWORD_MODAL, ResetPasswordModal } from '@features/reset-user-password';
import { routes } from '@shared/config';
import { formatHandleLevel, nickFromName, ruPlural } from '@shared/lib';
import { Dropdown, useModal, type DropdownItem } from '@shared/ui';
import { useState, type ReactNode } from 'react';
import styles from './AdminPage.module.css';

const text = t.admin;

type AdminPageProps = {
  users: AdminUser[];
  gifts: AdminGift[];
};

export function AdminPage({ users: initialUsers, gifts }: AdminPageProps) {
  const { openModal } = useModal();
  const [users, setUsers] = useState(initialUsers);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [editField, setEditField] = useState<EditUserField>('name');

  function open(user: AdminUser, modal: string) {
    setTarget(user);
    openModal(modal);
  }

  function edit(user: AdminUser, field: EditUserField) {
    setEditField(field);
    open(user, EDIT_USER_MODAL);
  }

  function saved(user: AdminUser) {
    setUsers((list) => list.map((item) => (item.id === user.id ? user : item)));
  }

  function actions(user: AdminUser): DropdownItem[] {
    return [
      { label: text.actions.profile, href: routes.adminUser(user.id) },
      { label: text.actions.gifts, href: routes.adminLists(user.id) },
      { label: text.actions.name, onSelect: () => edit(user, 'name') },
      { label: text.actions.handle, onSelect: () => edit(user, 'handle') },
      { label: text.actions.password, onSelect: () => open(user, RESET_PASSWORD_MODAL), danger: true },
    ];
  }

  return (
    <section className={styles.page}>
      <h1>{text.title}</h1>
      <div className={styles.layout}>
        <Panel count={users.length} label={ruPlural(users.length, text.users)}>
          {users.map((user) => (
            <div key={user.id} className={styles.row}>
              <span className={`px ${styles.avatar}`} aria-hidden="true">
                {displayName(user).slice(0, 1).toUpperCase()}
              </span>
              <span className={styles.who}>
                <strong>{displayName(user)}</strong>
                <small>{formatHandleLevel(user.handle || nickFromName(displayName(user)))}</small>
                <small className={styles.email}>
                  {user.email} · {text.roles[user.role]}
                </small>
              </span>
              <Dropdown label={text.actions.menu} items={actions(user)} />
            </div>
          ))}
        </Panel>

        <Panel count={gifts.length} label={ruPlural(gifts.length, text.gifts)}>
          {gifts.length === 0 && (
            <div className={styles.row}>
              <span className={styles.info}>
                <small>{text.noGifts}</small>
              </span>
            </div>
          )}
          {gifts.map((gift) => (
            <div key={gift.id} className={styles.row}>
              <span className={`px ${styles.thumb}`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- картинки с любых чужих доменов, next/image их не пропустит */}
                {gift.imageUrl && <img src={gift.imageUrl} alt="" loading="lazy" />}
              </span>
              <span className={styles.info}>
                <strong>{gift.title}</strong>
              </span>
              <span className={styles.price}>{gift.price ? formatPrice(gift.price) : text.noPrice}</span>
            </div>
          ))}
        </Panel>
      </div>
      <ResetPasswordModal user={target} />
      <EditUserModal user={target} field={editField} onSaved={saved} />
    </section>
  );
}

function displayName(user: AdminUser) {
  return user.name.trim() || t.common.defaultName;
}

function Panel({ count, label, children }: { count: number; label: string; children: ReactNode }) {
  return (
    <div className={`px ${styles.card}`}>
      <p className={styles.head}>
        <b>{count}</b>
        {label}
      </p>
      <div className={styles.list}>{children}</div>
    </div>
  );
}
