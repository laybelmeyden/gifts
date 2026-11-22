import { ShellLayout } from '@app/layouts';
import { getSessionUser } from '@server/auth';
import { getHiddenNav, getNavCounts } from '@server/settings';
import type { ReactNode } from 'react';

/** Вошедший видит вишлист по ссылке внутри своего сайдбара, гость - отдельной страницей без меню. */
export default async function SharedLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) return children;
  const [hiddenNav, counts] = await Promise.all([getHiddenNav(), getNavCounts(user.id)]);
  return (
    <ShellLayout hiddenNav={hiddenNav} counts={counts}>
      {children}
    </ShellLayout>
  );
}
