import { Header } from '@widgets/header';
import type { ReactNode } from 'react';
import styles from './layouts.module.css';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className={`${styles.page} ${styles.main}`}>
      <Header />
      {children}
    </main>
  );
}
