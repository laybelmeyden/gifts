import type { ReactNode } from 'react';
import styles from './layouts.module.css';

export function MainLayout({ children }: { children: ReactNode }) {
  return <main className={styles.bleed}>{children}</main>;
}
