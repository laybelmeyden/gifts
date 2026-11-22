import 'server-only';
import { sql } from 'drizzle-orm';
import type { WishlistSummary } from '../../contracts/wishlist';
import { db } from '../db';

export async function listWishlists(ownerId: string): Promise<WishlistSummary[]> {
  const result = await db.execute<WishlistSummary>(sql`
    select
      w."id",
      w."title",
      w."occasion",
      w."cover",
      to_char(w."event_date", 'YYYY-MM-DD') as "date",
      (w."event_date" - current_date) as "daysLeft",
      count(g."id")::int as "giftCount"
    from "wishlists" w
    left join "gifts" g on g."wishlist_id" = w."id"
    where w."owner_id" = ${ownerId}
    group by w."id"
    order by w."created_at" desc
  `);
  return result.rows;
}
