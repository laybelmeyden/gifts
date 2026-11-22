import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { wishlists } from './wishlists';

export const gifts = pgTable(
  'gifts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    wishlistId: uuid('wishlist_id').references(() => wishlists.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    imageUrl: text('image_url'),
    productUrl: text('product_url'),
    price: text('price'),
    category: text('category').notNull().default('other'),
    desire: text('desire').notNull().default('want'),
    cover: text('cover').notNull().default('gift'),
    comment: text('comment'),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('gifts_owner_created_idx').on(table.ownerId, table.createdAt.desc()),
    index('gifts_wishlist_idx').on(table.wishlistId),
  ],
);
