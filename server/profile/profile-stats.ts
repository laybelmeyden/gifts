import 'server-only';
import { sql } from 'drizzle-orm';
import type { ProfileStats } from '../../contracts/profile';
import { db } from '../db';

/** Счётчики карточки профиля: вишлисты, подарки во всех вишлистах и сколько из них получено. */
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const result = await db.execute<ProfileStats>(sql`
    select
      (select count(*)::int from "wishlists" where "owner_id" = ${userId}) as "lists",
      count(*)::int as "wishes",
      (count(*) filter (where "received_at" is not null))::int as "received"
    from "gifts"
    where "owner_id" = ${userId}
  `);
  return result.rows[0] ?? { lists: 0, wishes: 0, received: 0 };
}
