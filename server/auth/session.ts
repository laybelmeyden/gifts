import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import type { SessionUser } from '../../contracts/user';
import { auth } from './config';

/** Пользователь текущего запроса; в пределах одного рендера читается из базы один раз. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role ?? 'user',
  };
});
