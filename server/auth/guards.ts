import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { routes } from '../../contracts/routes';
import type { SessionUser } from '../../contracts/user';
import { getSessionUser } from './session';

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(routes.signIn);
  return user;
}

/** Не-админу админка не должна даже намекать, что существует. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'admin') notFound();
  return user;
}

export async function redirectIfSignedIn(): Promise<void> {
  if (await getSessionUser()) redirect(routes.myList);
}
