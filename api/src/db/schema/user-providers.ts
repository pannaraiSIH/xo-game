import { integer } from 'drizzle-orm/pg-core/columns/integer';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { users } from './users';
import { text } from 'drizzle-orm/pg-core/columns/text';
import { timestamp } from 'drizzle-orm/pg-core/columns/timestamp';
import { providerEnum } from './enums';

export const userProviders = pgTable('user_providers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  provider: providerEnum('provider').notNull(),
  providerUid: text('provider_uid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserProviders = typeof userProviders.$inferSelect;
export type NewUserProviders = typeof userProviders.$inferInsert;
