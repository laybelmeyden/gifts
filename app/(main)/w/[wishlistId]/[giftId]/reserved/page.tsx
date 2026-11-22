import { t } from '@contracts/i18n';
import { routes } from '@contracts/routes';
import { ReservedPage } from '@pages/shared-wishlist';
import { requireUser } from '@server/auth';
import { getSharedGift } from '@server/gifts';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = { title: t.meta.titles.reserved };

/** Экран после брони; если бронь не своя (отменили, открыли чужую ссылку) - обратно на подарок. */
export default async function ReservedRoute({ params }: PageProps<'/w/[wishlistId]/[giftId]/reserved'>) {
  const user = await requireUser();
  const { wishlistId, giftId } = await params;
  const gift = await getSharedGift(wishlistId, giftId, user.id);
  if (!gift) notFound();
  if (gift.status !== 'mine') redirect(routes.sharedGift(wishlistId, giftId));
  return <ReservedPage gift={gift} />;
}
