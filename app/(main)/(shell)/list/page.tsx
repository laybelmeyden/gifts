import { t } from '@contracts/i18n';
import { EmptyLists } from '@pages/my-lists';
import { requireUser } from '@server/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.myLists };

export default async function MyListRoute() {
  const user = await requireUser();
  return <EmptyLists name={user.name} />;
}
