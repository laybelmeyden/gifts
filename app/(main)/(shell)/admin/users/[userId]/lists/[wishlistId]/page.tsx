import { t } from '@contracts/i18n';
import { WishlistPage } from '@pages/wishlist';
import { getUserProfile } from '@server/admin';
import { requireAdmin } from '@server/auth';
import { getWishlist } from '@server/wishlists';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const load = cache(async (userId: string, wishlistId: string) => {
  await requireAdmin();
  const [user, list] = await Promise.all([getUserProfile(userId), getWishlist(userId, wishlistId)]);
  return user && list ? { user, list } : null;
});

type Props = PageProps<'/admin/users/[userId]/lists/[wishlistId]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId, wishlistId } = await params;
  const data = await load(userId, wishlistId);
  return { title: data?.list.title ?? t.meta.titles.notFound };
}

export default async function AdminWishlistRoute({ params }: Props) {
  const { userId, wishlistId } = await params;
  const data = await load(userId, wishlistId);
  if (!data) notFound();
  const name = data.user.name.trim() || t.common.defaultName;
  return <WishlistPage list={data.list} managedUser={{ id: userId, name }} />;
}
