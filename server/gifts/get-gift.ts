import 'server-only';
import { sql } from 'drizzle-orm';
import type { OwnerGiftDetail } from '../../contracts/gift';
import type { SharedGiftDetail } from '../../contracts/reservation';
import { db } from '../db';
import { giftStatus, ownerBooking } from '../reservations/gift-status';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const columns = sql`
  g."id",
  g."title",
  g."price",
  g."product_url" as "productUrl",
  g."category",
  g."desire",
  g."cover",
  g."image_url" as "imageUrl",
  g."comment",
  g."received_at" is not null as "received",
  w."id" as "wishlistId",
  w."title" as "wishlistTitle"
`;

export async function getGift(ownerId: string, wishlistId: string, giftId: string): Promise<OwnerGiftDetail | null> {
  if (!UUID.test(wishlistId) || !UUID.test(giftId)) return null;

  const result = await db.execute<OwnerGiftDetail>(sql`
    select ${columns}, ${ownerBooking} as "booking"
    from "gifts" g
    join "wishlists" w on w."id" = g."wishlist_id"
    left join "reservations" r on r."gift_id" = g."id"
    where g."id" = ${giftId} and w."id" = ${wishlistId} and w."owner_id" = ${ownerId}
  `);
  return result.rows[0] ?? null;
}

/** Подарок по ссылке: доступен, пока его вишлист открыт всем по ссылке. `own` - смотрит хозяин. */
export async function getSharedGift(
  wishlistId: string,
  giftId: string,
  viewerId: string | null,
): Promise<(SharedGiftDetail & { own: boolean }) | null> {
  if (!UUID.test(wishlistId) || !UUID.test(giftId)) return null;

  const result = await db.execute<SharedGiftDetail & { own: boolean }>(sql`
    select
      ${columns},
      ${giftStatus(viewerId)} as "status",
      u."name" as "ownerName",
      coalesce(w."owner_id" = ${viewerId}, false) as "own"
    from "gifts" g
    join "wishlists" w on w."id" = g."wishlist_id"
    join "user" u on u."id" = w."owner_id"
    left join "reservations" r on r."gift_id" = g."id"
    where g."id" = ${giftId} and w."id" = ${wishlistId} and w."visibility" = 'link'
  `);
  return result.rows[0] ?? null;
}
