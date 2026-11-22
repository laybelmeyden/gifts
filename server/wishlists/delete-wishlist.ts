import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { wishlists } from '../db/schema';

/** Подарки вишлиста удаляет каскад в БД. Возвращает false, если вишлиста нет или он чужой. */
export async function deleteWishlist(ownerId: string, wishlistId: string) {
  const deleted = await db
    .delete(wishlists)
    .where(and(eq(wishlists.id, wishlistId), eq(wishlists.ownerId, ownerId)))
    .returning({ id: wishlists.id });
  return deleted.length > 0;
}
