import { t } from '@contracts/i18n';
import { SignUpPage } from '@pages/sign-up';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.signUp };

export default async function SignUpRoute() {
  await redirectIfSignedIn();
  return <SignUpPage />;
}
