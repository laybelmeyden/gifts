import 'server-only';
import { sql } from 'drizzle-orm';
import { t } from '../../contracts/i18n';
import { createWishlistSchema } from '../../contracts/wishlist';
import { db } from '../db';

export type CreateWishlistResult =
  | { ok: true; id: string }
  | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function createWishlist(ownerId: string, input: unknown): Promise<CreateWishlistResult> {
  const parsed = createWishlistSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: t.api.checkFields, fields };
  }

  const list = parsed.data;
  const saved = await db.execute<{ id: string }>(sql`
    insert into "wishlists" ("owner_id", "title", "occasion", "cover", "event_date", "visibility")
    values (${ownerId}, ${list.title}, ${list.occasion}, ${list.cover}, ${list.date || null}, ${list.visibility})
    returning "id"
  `);
  return { ok: true, id: saved.rows[0]!.id };
}
