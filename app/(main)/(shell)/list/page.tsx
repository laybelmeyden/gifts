import { t } from '@contracts/i18n';
import { MyListsPage } from '@pages/my-lists';
import { requireUser } from '@server/auth';
import { listWishlists } from '@server/wishlists';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: t.meta.titles.myLists };

export default async function MyListRoute() {
  const user = await requireUser();
  const lists = await listWishlists(user.id);
  return <MyListsPage name={user.name} lists={lists} />;
}
