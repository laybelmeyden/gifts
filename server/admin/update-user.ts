import 'server-only';
import { sql } from 'drizzle-orm';
import { updateUserSchema, type AdminUser } from '../../contracts/admin';
import { t } from '../../contracts/i18n';
import { db } from '../db';

export type UpdateUserResult =
  | { ok: true; user: AdminUser }
  | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function updateUser(userId: string, input: unknown): Promise<UpdateUserResult> {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: parsed.error.issues[0]?.message ?? '', fields };
  }

  const { name = null, handle = null } = parsed.data;
  if (handle) {
    const taken = await db.execute<{ id: string }>(
      sql`select "id" from "user" where "handle" = ${handle} and "id" <> ${userId} limit 1`,
    );
    if (taken.rows[0]) {
      return {
        ok: false,
        status: 409,
        code: 'handle_taken',
        message: t.api.handleTaken,
        fields: { handle: t.api.handleTaken },
      };
    }
  }

  const saved = await db.execute<AdminUser>(sql`
    update "user"
    set
      "name" = coalesce(${name}, "name"),
      "handle" = coalesce(${handle}, "handle"),
      "updated_at" = now()
    where "id" = ${userId}
    returning "id", "name", "email", "handle", "role"
  `);
  const user = saved.rows[0];
  if (!user) return { ok: false, status: 404, code: 'not_found', message: t.api.userNotFound };
  return { ok: true, user };
}
