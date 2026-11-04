'use client';

import { useSession } from '@entities/session';
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
            Почта <strong>{session.user.email}</strong>
          </p>
          {session.user.role === 'admin' && (
            <ButtonLink variant="link" href={routes.admin}>
              Админка
            </ButtonLink>
          )}
          <ButtonLink variant="link" href={routes.myList}>
            Мой список
          </ButtonLink>
        </>
      ) : (
        <ButtonLink variant="link" href={routes.signIn}>
          Войти
        </ButtonLink>
      )}
    </header>
  );
}
