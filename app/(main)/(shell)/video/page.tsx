import { t } from '@contracts/i18n';
import { AdminVideoPage } from '@pages/admin-video';
import { listAllWishlists } from '@server/admin';
import { requireAdmin } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.video };

export default async function AdminVideoRoute() {
  await requireAdmin();
  const lists = await listAllWishlists();
  return <AdminVideoPage lists={lists} />;
}
