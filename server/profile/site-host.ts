import { headers } from 'next/headers';

/** Домен, с которого открыли сайт: на нём строится публичная ссылка на профиль. */
export async function getSiteHost() {
  const list = await headers();
  return list.get('x-forwarded-host') ?? list.get('host') ?? '';
}
