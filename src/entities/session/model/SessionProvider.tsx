'use client';

import type { SessionUser } from '@contracts/user';
import { createContext, use, useMemo, type ReactNode } from 'react';

export type Session =
  | { status: 'guest'; user: null }
  | { status: 'authenticated'; user: SessionUser };

const SessionContext = createContext<Session | null>(null);

type SessionProviderProps = {
  /** Пользователь, которого сервер прочитал из cookie при отрисовке страницы. */
  user: SessionUser | null;
  children: ReactNode;
};

export function SessionProvider({ user, children }: SessionProviderProps) {
  const session = useMemo<Session>(
    () => (user ? { status: 'authenticated', user } : { status: 'guest', user: null }),
    [user],
  );
  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession(): Session {
  const session = use(SessionContext);
  if (!session) throw new Error('useSession нужно вызывать внутри SessionProvider');
  return session;
}
