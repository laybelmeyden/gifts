import 'server-only';
import { and, eq } from 'drizzle-orm';
import { updateGiftSchema } from '../../contracts/gift';
import { t } from '../../contracts/i18n';
import { db } from '../db';
import { gifts } from '../db/schema';

export type UpdateGiftResult =
  { ok: true } | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function updateGift(ownerId: string, giftId: string, input: unknown): Promise<UpdateGiftResult> {
  const parsed = updateGiftSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: t.api.checkFields, fields };
  }

  const { productUrl, price, comment, photo, received, ...rest } = parsed.data;
  const saved = await db
    .update(gifts)
    .set({
      ...rest,
      ...(productUrl !== undefined && { productUrl: productUrl || null }),
      ...(price !== undefined && { price: price || null }),
      ...(comment !== undefined && { comment: comment || null }),
      ...(photo !== undefined && { imageUrl: photo || null }),
      ...(received !== undefined && { receivedAt: received ? new Date() : null }),
    })
    .where(and(eq(gifts.id, giftId), eq(gifts.ownerId, ownerId)))
    .returning({ id: gifts.id });

  if (!saved[0]) return { ok: false, status: 404, code: 'not_found', message: t.api.notFound };
  return { ok: true };
}
