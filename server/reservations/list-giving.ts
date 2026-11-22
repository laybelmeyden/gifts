import 'server-only';
import { sql } from 'drizzle-orm';
import type { GivingGift } from '../../contracts/reservation';
import { db } from '../db';

/** Раздел «Я дарю»: брони пользователя, ближайшие праздники сверху, без даты - в конце. */
export async function listGiving(userId: string): Promise<GivingGift[]> {
  const result = await db.execute<GivingGift>(sql`
    select
      g."id" as "giftId",
      w."id" as "wishlistId",
      w."title" as "wishlistTitle",
      u."name" as "ownerName",
      g."title",
      g."price",
      g."cover",
      g."image_url" as "imageUrl",
      g."received_at" is not null as "received",
      r."purchased_at" is not null as "purchased",
      to_char(w."event_date", 'YYYY-MM-DD') as "date",
      (w."event_date" - current_date) as "daysLeft"
    from "reservations" r
    join "gifts" g on g."id" = r."gift_id"
    join "wishlists" w on w."id" = g."wishlist_id"
    join "user" u on u."id" = w."owner_id"
    where r."user_id" = ${userId}
    order by w."event_date" asc nulls last, w."id", r."created_at" desc
  `);
  return result.rows;
}
