import 'server-only';
import { sql } from 'drizzle-orm';
import type { AdminWishlist } from '../../contracts/admin';
import { db } from '../db';

export async function listAllWishlists(): Promise<AdminWishlist[]> {
  const result = await db.execute<AdminWishlist>(sql`
    select
      w."id",
      w."title",
      w."occasion",
      w."cover",
      to_char(w."event_date", 'YYYY-MM-DD') as "date",
      (w."event_date" - current_date) as "daysLeft",
      count(g."id")::int as "giftCount",
      w."owner_id" as "ownerId",
      u."name" as "ownerName"
    from "wishlists" w
    join "user" u on u."id" = w."owner_id"
    left join "gifts" g on g."wishlist_id" = w."id"
    group by w."id", u."name"
    order by w."created_at" desc
  `);
  return result.rows;
}
