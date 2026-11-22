import { t } from '@contracts/i18n';
import { GiftPage } from '@pages/gift';
import { requireUser } from '@server/auth';
import { getGift } from '@server/gifts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const loadGift = cache(async (wishlistId: string, giftId: string) => {
  const user = await requireUser();
  return getGift(user.id, wishlistId, giftId);
});

export async function generateMetadata({ params }: PageProps<'/list/[wishlistId]/[giftId]'>): Promise<Metadata> {
  const { wishlistId, giftId } = await params;
  const gift = await loadGift(wishlistId, giftId);
  return { title: gift?.title ?? t.meta.titles.notFound };
}

export default async function GiftRoute({ params }: PageProps<'/list/[wishlistId]/[giftId]'>) {
  const { wishlistId, giftId } = await params;
  const gift = await loadGift(wishlistId, giftId);
  if (!gift) notFound();
  return <GiftPage gift={gift} />;
}
