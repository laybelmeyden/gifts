import { shareMetadata } from '@app/layouts';
import { t } from '@contracts/i18n';
import { routes } from '@contracts/routes';
import { SharedGiftPage } from '@pages/shared-wishlist';
import { getSessionUser } from '@server/auth';
import { getSharedGift } from '@server/gifts';
import { getSharedWishlist } from '@server/wishlists';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';

const MORE_COUNT = 5;

const loadGift = cache(getSharedGift);

async function load(wishlistId: string, giftId: string) {
  const user = await getSessionUser();
  return { user, gift: await loadGift(wishlistId, giftId, user?.id ?? null) };
}

export async function generateMetadata({ params }: PageProps<'/w/[wishlistId]/[giftId]'>): Promise<Metadata> {
  const { wishlistId, giftId } = await params;
  const { gift } = await load(wishlistId, giftId);
  if (!gift) return { title: t.meta.titles.notFound };
  return shareMetadata(gift.title, t.meta.share.gift(gift.ownerName, gift.wishlistTitle));
}

export default async function SharedGiftRoute({ params }: PageProps<'/w/[wishlistId]/[giftId]'>) {
  const { wishlistId, giftId } = await params;
  const { user, gift } = await load(wishlistId, giftId);
  if (!gift) notFound();
  if (gift.own) redirect(routes.gift(wishlistId, giftId));

  const list = await getSharedWishlist(wishlistId, user?.id ?? null);
  const more = (list?.gifts ?? []).filter((item) => item.id !== giftId).slice(0, MORE_COUNT);
  return <SharedGiftPage gift={gift} more={more} standalone={!user} />;
}
