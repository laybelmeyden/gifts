import { t } from '@contracts/i18n';
import { WishlistVideoPage } from '@pages/wishlist-video';
import { requireAdmin } from '@server/auth';
import { getSiteHost } from '@server/profile';
import { getWishlistById } from '@server/wishlists';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const loadWishlist = cache(async (wishlistId: string) => {
  await requireAdmin();
  return getWishlistById(wishlistId);
});

function publicHost(host: string) {
  const clean = host.replace(/^www\./i, '').replace(/:\d+$/, '');
  if (!clean || clean.startsWith('localhost') || clean.startsWith('127.')) return 'pixelgifts.ru';
  return clean;
}

export async function generateMetadata({ params }: PageProps<'/video/[wishlistId]'>): Promise<Metadata> {
  const list = await loadWishlist((await params).wishlistId);
  return { title: list ? t.meta.titles.video : t.meta.titles.notFound };
}

export default async function AdminWishlistVideoRoute({ params }: PageProps<'/video/[wishlistId]'>) {
  const [list, host] = await Promise.all([loadWishlist((await params).wishlistId), getSiteHost()]);
  if (!list) notFound();
  return <WishlistVideoPage list={list} host={publicHost(host)} />;
}
