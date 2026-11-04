import type { SessionUser } from '@contracts/user';
import { SessionProvider } from '@entities/session';
import { UiProvider } from '@shared/ui';
import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';

type AppProvidersProps = {
  user: SessionUser | null;
  children: ReactNode;
};

export function AppProviders({ user, children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SessionProvider user={user}>
        <UiProvider>{children}</UiProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
