import { integer } from 'drizzle-orm/pg-core/columns/integer';
import { pgTable } from 'drizzle-orm/pg-core/table';
import { users } from './users';
import { timestamp } from 'drizzle-orm/pg-core/columns/timestamp';

export const userScores = pgTable('user_scores', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  totalScore: integer('total_score').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserScores = typeof userScores.$inferSelect;
export type NewUserScores = typeof userScores.$inferInsert;
