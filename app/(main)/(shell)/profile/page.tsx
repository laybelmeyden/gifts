import { ProfilePage } from '@pages/profile';
import { requireUser } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'профиль' };

export default async function ProfileRoute() {
  const user = await requireUser();
  return <ProfilePage name={user.name} email={user.email} handle={user.handle} birthday={user.birthday} />;
}
