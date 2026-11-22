import { t } from '@contracts/i18n';
import { MyListsPage } from '@pages/my-lists';
import { getUserProfile } from '@server/admin';
import { requireAdmin } from '@server/auth';
import { listWishlists } from '@server/wishlists';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: t.meta.titles.admin };

export default async function AdminUserListsRoute({ params }: PageProps<'/admin/users/[userId]/lists'>) {
  await requireAdmin();
  const { userId } = await params;
  const [user, lists] = await Promise.all([getUserProfile(userId), listWishlists(userId)]);
  if (!user) notFound();
  const name = user.name.trim() || t.common.defaultName;
  return <MyListsPage name={name} lists={lists} managedUser={{ id: userId, name }} />;
}
