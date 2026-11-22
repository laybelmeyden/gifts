import type { NavCounts, NavKey } from '@contracts/nav';
import { AppShell } from '@widgets/app-shell';
import type { ReactNode } from 'react';

type ShellLayoutProps = { hiddenNav: NavKey[]; counts: NavCounts; children: ReactNode };

export function ShellLayout({ hiddenNav, counts, children }: ShellLayoutProps) {
  return (
    <AppShell hiddenNav={hiddenNav} counts={counts}>
      {children}
    </AppShell>
  );
}
