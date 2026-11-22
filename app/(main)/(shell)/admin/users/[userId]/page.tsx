import { t } from '@contracts/i18n';
import { ProfilePage } from '@pages/profile';
import { getUserProfile } from '@server/admin';
import { requireAdmin } from '@server/auth';
import { getProfileStats, getSiteHost } from '@server/profile';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: t.meta.titles.profile };

export default async function AdminUserRoute({ params }: PageProps<'/admin/users/[userId]'>) {
  await requireAdmin();
  const { userId } = await params;
  const [user, host, stats] = await Promise.all([getUserProfile(userId), getSiteHost(), getProfileStats(userId)]);
  if (!user) notFound();
  return (
    <ProfilePage
      userId={userId}
      host={host}
      name={user.name}
      email={user.email}
      handle={user.handle}
      birthday={user.birthday}
      stats={stats}
    />
  );
}
