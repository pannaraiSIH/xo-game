import { integer, timestamp } from 'drizzle-orm/pg-core/columns';
import { pgTable } from 'drizzle-orm/pg-core';
import { gameResultEnum } from './enums';
import { users } from './users';

export const gameResults = pgTable('game_results', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  result: gameResultEnum('result').notNull(),
  scoreChange: integer('score_change').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ScoreHistory = typeof gameResults.$inferSelect;
export type NewScoreHistory = typeof gameResults.$inferInsert;
