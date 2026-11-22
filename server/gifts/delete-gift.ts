import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { gifts } from '../db/schema';

/** Возвращает false, если подарка нет или он чужой. */
export async function deleteGift(ownerId: string, giftId: string) {
  const deleted = await db
    .delete(gifts)
    .where(and(eq(gifts.id, giftId), eq(gifts.ownerId, ownerId)))
    .returning({ id: gifts.id });
  return deleted.length > 0;
}
