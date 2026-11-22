import 'server-only';
import { sql } from 'drizzle-orm';
import { updateProfileSchema, type ProfileFields } from '../../contracts/profile';
import { db } from '../db';

export type UpdateProfileResult =
  | { ok: true; profile: ProfileFields }
  | { ok: false; status: number; code: string; message: string; fields?: Partial<Record<string, string>> };

export async function updateProfile(userId: string, input: unknown): Promise<UpdateProfileResult> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return { ok: false, status: 400, code: 'validation', message: 'Проверьте поля.', fields };
  }

  const data = parsed.data;
  const taken = await db.execute<{ id: string }>(
    sql`select "id" from "user" where "handle" = ${data.handle} and "id" <> ${userId} limit 1`,
  );
  if (taken.rows[0]) {
    return {
      ok: false,
      status: 409,
      code: 'handle_taken',
      message: 'Этот ник уже занят.',
      fields: { handle: 'Этот ник уже занят.' },
    };
  }

  const birthday = data.birthday === '' ? null : data.birthday;

  try {
    const saved = await db.execute<ProfileFields>(sql`
      update "user"
      set
        "name" = ${data.name},
        "email" = ${data.email},
        "handle" = ${data.handle},
        "birthday" = ${birthday},
        "updated_at" = now()
      where "id" = ${userId}
      returning "name", "email", "handle", "birthday"
    `);
    const profile = saved.rows[0];
    if (!profile) {
      return { ok: false, status: 404, code: 'not_found', message: 'Пользователь не найден.' };
    }
    return { ok: true, profile };
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        status: 409,
        code: 'email_taken',
        message: 'Эта почта уже занята.',
        fields: { email: 'Эта почта уже занята.' },
      };
    }
    throw error;
  }
}

function isUniqueViolation(error: unknown) {
  if (typeof error !== 'object' || error === null) return false;
  if ('code' in error && (error as { code: string }).code === '23505') return true;
  const cause = 'cause' in error ? error.cause : undefined;
  return typeof cause === 'object' && cause !== null && 'code' in cause && (cause as { code: string }).code === '23505';
}
