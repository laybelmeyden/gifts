import { t } from '@contracts/i18n';
import { safeNext } from '@contracts/routes';
import { SignInPage } from '@pages/sign-in';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.signIn };

export default async function SignInRoute({ searchParams }: PageProps<'/sign-in'>) {
  const next = safeNext((await searchParams).next);
  await redirectIfSignedIn(next);
  return <SignInPage next={next} />;
}
