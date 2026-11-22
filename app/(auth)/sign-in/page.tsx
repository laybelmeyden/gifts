import { t } from '@contracts/i18n';
import { SignInPage } from '@pages/sign-in';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.signIn };

export default async function SignInRoute() {
  await redirectIfSignedIn();
  return <SignInPage />;
}
