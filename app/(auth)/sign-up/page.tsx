import { SignUpPage } from '@pages/sign-up';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'регистрация' };

export default async function SignUpRoute() {
  await redirectIfSignedIn();
  return <SignUpPage />;
}
