'use client';

import { t } from '@contracts/i18n';
import { useSession } from '@entities/session';
import { SignOutButton } from '@features/auth';
import { routes } from '@shared/config';
import { ButtonLink } from '@shared/ui';
import styles from './Header.module.css';

export function Header() {
  const session = useSession();

  return (
    <header className={styles.header}>
      {session.status === 'authenticated' ? (
        <>
          <p className={styles.item}>
            {t.header.email} <strong>{session.user.email}</strong>
          </p>
          {session.user.role === 'admin' && (
            <ButtonLink variant="link" href={routes.admin}>
              {t.header.admin}
            </ButtonLink>
          )}
          <ButtonLink variant="link" href={routes.myList}>
            {t.header.myList}
          </ButtonLink>
          <SignOutButton />
        </>
      ) : (
        <ButtonLink variant="link" href={routes.signIn}>
          {t.common.signIn}
        </ButtonLink>
      )}
    </header>
  );
}
