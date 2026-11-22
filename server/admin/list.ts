import 'server-only';
import { sql } from 'drizzle-orm';
import type { AdminGift, AdminUser } from '../../contracts/admin';
import { db } from '../db';

export async function listUsers(): Promise<AdminUser[]> {
  const result = await db.execute<AdminUser>(
    sql`select "id", "name", "email", "handle", "role" from "user" order by "created_at"`,
  );
  return result.rows;
}

export async function listGifts(): Promise<AdminGift[]> {
  const result = await db.execute<AdminGift>(
    sql`select "id", "title", "price", "image_url" as "imageUrl" from "gifts" order by "created_at" desc`,
  );
  return result.rows;
}
