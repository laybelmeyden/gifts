import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { gifts } from './gifts';

/** Бронь подарка. gift_id - первичный ключ: забронировать один подарок дважды нельзя. */
export const reservations = pgTable(
  'reservations',
  {
    giftId: uuid('gift_id')
      .primaryKey()
      .references(() => gifts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    anonymous: boolean('anonymous').notNull().default(true),
    /** Дарящий отметил «Купила»; хозяину не показывается. */
    purchasedAt: timestamp('purchased_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('reservations_user_created_idx').on(table.userId, table.createdAt.desc())],
);
