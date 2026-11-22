import { AppShell } from '@widgets/app-shell';
import type { ReactNode } from 'react';

export function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
