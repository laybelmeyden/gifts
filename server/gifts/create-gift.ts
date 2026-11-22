import 'server-only';
import { sql } from 'drizzle-orm';
import { createGiftSchema } from '../../contracts/gift';
import { t } from '../../contracts/i18n';
import { db } from '../db';

export type CreateGiftResult =
  | { ok: true; id: string }
  | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function createGift(ownerId: string, input: unknown): Promise<CreateGiftResult> {
  const parsed = createGiftSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: t.api.checkFields, fields };
  }

  const gift = parsed.data;
  const saved = await db.execute<{ id: string }>(sql`
    insert into "gifts" (
      "owner_id", "wishlist_id", "title", "product_url", "price", "category", "desire", "comment", "cover", "image_url"
    )
    select
      ${ownerId},
      "id",
      ${gift.title},
      ${gift.productUrl || null},
      ${gift.price || null},
      ${gift.category},
      ${gift.desire},
      ${gift.comment || null},
      ${gift.cover},
      ${gift.photo || null}
    from "wishlists"
    where "id" = ${gift.wishlistId} and "owner_id" = ${ownerId}
    returning "id"
  `);
  const row = saved.rows[0];
  if (!row) return { ok: false, status: 404, code: 'not_found', message: t.api.notFound };
  return { ok: true, id: row.id };
}
