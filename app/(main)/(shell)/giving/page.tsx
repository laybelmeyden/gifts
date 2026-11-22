import { t } from '@contracts/i18n';
import { GivingPage } from '@pages/giving';
import { requireUser } from '@server/auth';
import { listGiving } from '@server/reservations';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.giving };

export default async function GivingRoute() {
  const user = await requireUser();
  const gifts = await listGiving(user.id);
  return <GivingPage gifts={gifts} />;
}
