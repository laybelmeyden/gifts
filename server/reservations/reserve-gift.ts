import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { t } from '../../contracts/i18n';
import { reserveGiftSchema, updateReservationSchema } from '../../contracts/reservation';
import { db } from '../db';
import { reservations } from '../db/schema';

export type ReserveGiftResult =
  { ok: true } | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

type Target = { ownerId: string; received: boolean };

export async function reserveGift(userId: string, giftId: string, input: unknown): Promise<ReserveGiftResult> {
  const parsed = reserveGiftSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: t.api.checkFields, fields };
  }

  // Бронировать можно только подарки из вишлистов, открытых всем по ссылке.
  const found = await db.execute<Target>(sql`
    select w."owner_id" as "ownerId", g."received_at" is not null as "received"
    from "gifts" g
    join "wishlists" w on w."id" = g."wishlist_id"
    where g."id" = ${giftId} and w."visibility" = 'link'
  `);
  const target = found.rows[0];
  if (!target) return { ok: false, status: 404, code: 'not_found', message: t.api.notFound };
  if (target.ownerId === userId) return { ok: false, status: 403, code: 'own_gift', message: t.reserve.errors.own };
  if (target.received) return { ok: false, status: 409, code: 'received', message: t.reserve.errors.received };

  const saved = await db
    .insert(reservations)
    .values({ giftId, userId, name: parsed.data.name, anonymous: parsed.data.anonymous })
    .onConflictDoNothing()
    .returning({ giftId: reservations.giftId });
  if (!saved[0]) return { ok: false, status: 409, code: 'taken', message: t.reserve.errors.taken };
  return { ok: true };
}

/** Отметка «Купила» только на своей брони; false - подарок не найден или бронь чужая. */
export async function setPurchased(userId: string, giftId: string, input: unknown): Promise<boolean | 'invalid'> {
  const parsed = updateReservationSchema.safeParse(input);
  if (!parsed.success) return 'invalid';
  const saved = await db
    .update(reservations)
    .set({ purchasedAt: parsed.data.purchased ? new Date() : null })
    .where(and(eq(reservations.giftId, giftId), eq(reservations.userId, userId)))
    .returning({ giftId: reservations.giftId });
  return saved.length > 0;
}

/** Снять можно только свою бронь. */
export async function cancelReservation(userId: string, giftId: string): Promise<boolean> {
  const removed = await db
    .delete(reservations)
    .where(and(eq(reservations.giftId, giftId), eq(reservations.userId, userId)))
    .returning({ giftId: reservations.giftId });
  return removed.length > 0;
}
