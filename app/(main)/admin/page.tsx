import { AdminPage } from '@pages/admin';
import { requireAdmin } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'админка' };

export default async function AdminRoute() {
  await requireAdmin();
  return <AdminPage />;
}
