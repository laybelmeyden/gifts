import 'server-only';
import { sql } from 'drizzle-orm';
import { NAV_KEYS, navVisibilitySchema, type NavCounts, type NavKey } from '../../contracts/nav';
import { db } from '../db';

export async function getHiddenNav(): Promise<NavKey[]> {
  const result = await db.execute<{ key: string }>(sql`select "key" from "nav_settings" where "hidden"`);
  return result.rows.map((row) => row.key).filter((key): key is NavKey => NAV_KEYS.includes(key as NavKey));
}

export async function getNavCounts(userId: string): Promise<NavCounts> {
  const result = await db.execute<{ lists: number; giving: number }>(sql`
    select
      (select count(*)::int from "wishlists" where "owner_id" = ${userId}) as "lists",
      (select count(*)::int from "reservations" where "user_id" = ${userId}) as "giving"
  `);
  return result.rows[0] ?? {};
}

export type SetNavVisibilityResult = { ok: true } | { ok: false; status: number; code: string; message: string };

export async function setNavVisibility(input: unknown): Promise<SetNavVisibilityResult> {
  const parsed = navVisibilitySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, status: 400, code: 'validation', message: parsed.error.issues[0]?.message ?? '' };
  }
  const { key, visible } = parsed.data;
  await db.execute(sql`
    insert into "nav_settings" ("key", "hidden", "updated_at")
    values (${key}, ${!visible}, now())
    on conflict ("key") do update set "hidden" = excluded."hidden", "updated_at" = now()
  `);
  return { ok: true };
}
