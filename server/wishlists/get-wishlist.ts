import 'server-only';
import { sql } from 'drizzle-orm';
import type { OwnerGift } from '../../contracts/gift';
import type { SharedGift, SharedWishlist } from '../../contracts/reservation';
import type { WishlistDetail } from '../../contracts/wishlist';
import { db } from '../db';
import { giftStatus, ownerBooking } from '../reservations/gift-status';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const listColumns = sql`
  w."id",
  w."title",
  w."occasion",
  w."cover",
  to_char(w."event_date", 'YYYY-MM-DD') as "date",
  (w."event_date" - current_date) as "daysLeft"
`;

const giftColumns = sql`
  g."id",
  g."title",
  g."price",
  g."product_url" as "productUrl",
  g."category",
  g."desire",
  g."cover",
  g."image_url" as "imageUrl",
  g."received_at" is not null as "received"
`;

export async function getWishlist(ownerId: string, wishlistId: string): Promise<WishlistDetail | null> {
  if (!UUID.test(wishlistId)) return null;

  const lists = await db.execute<Omit<WishlistDetail, 'gifts'>>(sql`
    select
      ${listColumns},
      w."visibility",
      (select count(*)::int from "reservations" r join "gifts" g on g."id" = r."gift_id"
        where g."wishlist_id" = w."id") as "bookedCount"
    from "wishlists" w
    where w."id" = ${wishlistId} and w."owner_id" = ${ownerId}
  `);
  const list = lists.rows[0];
  if (!list) return null;

  const gifts = await db.execute<OwnerGift>(sql`
    select ${giftColumns}, ${ownerBooking} as "booking"
    from "gifts" g
    left join "reservations" r on r."gift_id" = g."id"
    where g."wishlist_id" = ${wishlistId}
    order by g."created_at" desc
  `);
  return { ...list, gifts: gifts.rows };
}

/**
 * Вишлист по ссылке «Поделиться»: только если хозяин открыл его всем по ссылке.
 * `own` - смотрит сам хозяин, его уводим на обычную страницу вишлиста.
 */
export async function getSharedWishlist(
  wishlistId: string,
  viewerId: string | null,
): Promise<(SharedWishlist & { own: boolean }) | null> {
  if (!UUID.test(wishlistId)) return null;

  const lists = await db.execute<Omit<SharedWishlist, 'gifts'> & { own: boolean }>(sql`
    select
      ${listColumns},
      u."name" as "ownerName",
      coalesce(w."owner_id" = ${viewerId}, false) as "own"
    from "wishlists" w
    join "user" u on u."id" = w."owner_id"
    where w."id" = ${wishlistId} and w."visibility" = 'link'
  `);
  const list = lists.rows[0];
  if (!list) return null;

  const gifts = await db.execute<SharedGift>(sql`
    select ${giftColumns}, ${giftStatus(viewerId)} as "status"
    from "gifts" g
    left join "reservations" r on r."gift_id" = g."id"
    where g."wishlist_id" = ${wishlistId}
    order by g."created_at" desc
  `);
  return { ...list, gifts: gifts.rows };
}
