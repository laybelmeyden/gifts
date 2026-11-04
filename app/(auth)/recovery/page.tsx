import { RecoveryPage } from '@pages/recovery';
import { redirectIfSignedIn } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'восстановление пароля' };

export default async function RecoveryRoute() {
  await redirectIfSignedIn();
  return <RecoveryPage />;
}
