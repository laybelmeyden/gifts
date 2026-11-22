import { date, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const wishlists = pgTable(
  'wishlists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    occasion: text('occasion').notNull().default('just'),
    cover: text('cover').notNull().default('gift'),
    eventDate: date('event_date', { mode: 'string' }),
    visibility: text('visibility').notNull().default('link'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('wishlists_owner_created_idx').on(table.ownerId, table.createdAt.desc())],
);
