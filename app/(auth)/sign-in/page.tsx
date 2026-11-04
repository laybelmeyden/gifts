import { SignInPage } from '@pages/sign-in';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'вход' };

export default async function SignInRoute() {
  await redirectIfSignedIn();
  return <SignInPage />;
}
