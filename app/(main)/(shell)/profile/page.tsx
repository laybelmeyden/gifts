import { t } from '@contracts/i18n';
import { ProfilePage } from '@pages/profile';
import { requireUser } from '@server/auth';
import { getProfileStats, getSiteHost } from '@server/profile';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.profile };

export default async function ProfileRoute() {
  const [user, host] = await Promise.all([requireUser(), getSiteHost()]);
  const stats = await getProfileStats(user.id);
  return (
    <ProfilePage
      host={host}
      name={user.name}
      email={user.email}
      handle={user.handle}
      birthday={user.birthday}
      stats={stats}
    />
  );
}
