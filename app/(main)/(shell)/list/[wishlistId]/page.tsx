import { t } from '@contracts/i18n';
import { WishlistPage } from '@pages/wishlist';
import { requireUser } from '@server/auth';
import { getWishlist } from '@server/wishlists';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const loadWishlist = cache(async (wishlistId: string) => {
  const user = await requireUser();
  return getWishlist(user.id, wishlistId);
});

export async function generateMetadata({ params }: PageProps<'/list/[wishlistId]'>): Promise<Metadata> {
  const list = await loadWishlist((await params).wishlistId);
  return { title: list?.title ?? t.meta.titles.notFound };
}

export default async function WishlistRoute({ params }: PageProps<'/list/[wishlistId]'>) {
  const list = await loadWishlist((await params).wishlistId);
  if (!list) notFound();
  return <WishlistPage list={list} />;
}
