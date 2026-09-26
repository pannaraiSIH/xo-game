import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    userProviders: r.many.userProviders(),
    userScores: r.one.userScores({
      from: r.users.id,
      to: r.userScores.userId,
    }),
    gameResults: r.many.gameResults(),
  },
  userProviders: {
    users: r.one.users({ from: r.userProviders.userId, to: r.users.id }),
  },
  userScores: {
    users: r.one.users({ from: r.userScores.userId, to: r.users.id }),
  },
  gameResults: {
    users: r.one.users({ from: r.gameResults.userId, to: r.users.id }),
  },
}));
