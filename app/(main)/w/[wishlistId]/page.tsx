import { shareMetadata } from '@app/layouts';
import { t } from '@contracts/i18n';
import { routes } from '@contracts/routes';
import { SharedWishlistPage } from '@pages/shared-wishlist';
import { getSessionUser } from '@server/auth';
import { getSharedWishlist } from '@server/wishlists';
import { ruPlural } from '@shared/lib';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';

const loadWishlist = cache(getSharedWishlist);

async function load(wishlistId: string) {
  const user = await getSessionUser();
  return { user, list: await loadWishlist(wishlistId, user?.id ?? null) };
}

export async function generateMetadata({ params }: PageProps<'/w/[wishlistId]'>): Promise<Metadata> {
  const { list } = await load((await params).wishlistId);
  if (!list) return { title: t.meta.titles.notFound };
  const count = list.gifts.length;
  const gifts = count ? `${count} ${ruPlural(count, t.myLists.gifts)}` : '';
  return shareMetadata(list.title, t.meta.share.wishlist(list.ownerName, gifts));
}

export default async function SharedWishlistRoute({ params }: PageProps<'/w/[wishlistId]'>) {
  const { user, list } = await load((await params).wishlistId);
  if (!list) notFound();
  if (list.own) redirect(routes.wishlist(list.id));
  return <SharedWishlistPage list={list} standalone={!user} />;
}
