import 'server-only';
import { sql } from 'drizzle-orm';
import type { SessionUser } from '../../contracts/user';
import { db } from '../db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * От чьего имени выполнить действие с вишлистом. Обычный пользователь - всегда от своего,
 * поэтому чужой вишлист для него просто не найдётся. Админ - от имени хозяина вишлиста.
 */
export async function ownerOfWishlist(session: SessionUser, wishlistId: unknown): Promise<string> {
  if (session.role !== 'admin' || typeof wishlistId !== 'string' || !UUID.test(wishlistId)) return session.id;
  const result = await db.execute<{ ownerId: string }>(
    sql`select "owner_id" as "ownerId" from "wishlists" where "id" = ${wishlistId}`,
  );
  return result.rows[0]?.ownerId ?? session.id;
}

/** То же для подарка: админ действует от имени хозяина подарка. */
export async function ownerOfGift(session: SessionUser, giftId: string): Promise<string> {
  if (session.role !== 'admin' || !UUID.test(giftId)) return session.id;
  const result = await db.execute<{ ownerId: string }>(
    sql`select "owner_id" as "ownerId" from "gifts" where "id" = ${giftId}`,
  );
  return result.rows[0]?.ownerId ?? session.id;
}
