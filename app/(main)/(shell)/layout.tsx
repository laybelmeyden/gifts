import { ShellLayout } from '@app/layouts';
import { getSessionUser } from '@server/auth';
import { getHiddenNav, getNavCounts } from '@server/settings';
import type { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  const [hiddenNav, counts] = await Promise.all([getHiddenNav(), user ? getNavCounts(user.id) : {}]);
  return (
    <ShellLayout hiddenNav={hiddenNav} counts={counts}>
      {children}
    </ShellLayout>
  );
}
