import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const navSettings = pgTable('nav_settings', {
  key: text('key').primaryKey(),
  hidden: boolean('hidden').notNull().default(false),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
