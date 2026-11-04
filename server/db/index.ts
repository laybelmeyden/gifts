import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL не задан. Локально он берётся из .env.local, на Vercel — из интеграции Neon.');
}

// HTTP-драйвер Neon: без пула соединений, подходит для serverless.
// Интерактивных транзакций нет — атомарные цепочки запросов делаем через db.batch([...]).
export const db = drizzle({ client: neon(databaseUrl), schema });

export type Db = typeof db;
