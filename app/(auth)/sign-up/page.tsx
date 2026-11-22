import { t } from '@contracts/i18n';
import { safeNext } from '@contracts/routes';
import { SignUpPage } from '@pages/sign-up';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.signUp };

export default async function SignUpRoute({ searchParams }: PageProps<'/sign-up'>) {
  const next = safeNext((await searchParams).next);
  await redirectIfSignedIn(next);
  return <SignUpPage next={next} />;
}
