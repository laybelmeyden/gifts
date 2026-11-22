import { t } from '@contracts/i18n';
import { AdminPage } from '@pages/admin';
import { listGifts, listUsers } from '@server/admin';
import { requireAdmin } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.admin };

export default async function AdminRoute() {
  await requireAdmin();
  const [users, gifts] = await Promise.all([listUsers(), listGifts()]);
  return <AdminPage users={users} gifts={gifts} />;
}
