import type { ReactNode } from 'react';
import styles from './layouts.module.css';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`${styles.page} ${styles.auth}`}>
      <div className={styles.authScreen}>{children}</div>
    </main>
  );
}
