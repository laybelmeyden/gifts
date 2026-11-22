import { t } from '@contracts/i18n';
import { GiftPage } from '@pages/gift';
import { getUserProfile } from '@server/admin';
import { requireAdmin } from '@server/auth';
import { getGift } from '@server/gifts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const load = cache(async (userId: string, wishlistId: string, giftId: string) => {
  await requireAdmin();
  const [user, gift] = await Promise.all([getUserProfile(userId), getGift(userId, wishlistId, giftId)]);
  return user && gift ? { user, gift } : null;
});

type Props = PageProps<'/admin/users/[userId]/lists/[wishlistId]/[giftId]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId, wishlistId, giftId } = await params;
  const data = await load(userId, wishlistId, giftId);
  return { title: data?.gift.title ?? t.meta.titles.notFound };
}

export default async function AdminGiftRoute({ params }: Props) {
  const { userId, wishlistId, giftId } = await params;
  const data = await load(userId, wishlistId, giftId);
  if (!data) notFound();
  const name = data.user.name.trim() || t.common.defaultName;
  return <GiftPage gift={data.gift} managedUser={{ id: userId, name }} />;
}
