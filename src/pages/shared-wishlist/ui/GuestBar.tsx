import { t } from '@contracts/i18n';
import { routes } from '@shared/config';
import { cx } from '@shared/lib';
import { Logo } from '@shared/ui';
import Link from 'next/link';
import styles from './GuestBar.module.css';

/** Верхняя строка для гостя без входа: сайдбара нет, поэтому лого и приглашение завести свой вишлист. */
export function GuestBar() {
  return (
    <header className={styles.bar}>
      <Logo />
      <Link className={cx('px', styles.create)} href={routes.signUp}>
        <span className={styles.plus} aria-hidden="true" />
        {t.shared.createOwn}
      </Link>
    </header>
  );
}
