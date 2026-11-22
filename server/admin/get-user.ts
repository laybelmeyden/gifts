import 'server-only';
import { sql } from 'drizzle-orm';
import type { ProfileFields } from '../../contracts/profile';
import { db } from '../db';

export async function getUserProfile(userId: string): Promise<ProfileFields | null> {
  const result = await db.execute<ProfileFields>(
    sql`select "name", "email", "handle", "birthday" from "user" where "id" = ${userId} limit 1`,
  );
  return result.rows[0] ?? null;
}
