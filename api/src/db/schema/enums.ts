import { pgEnum } from 'drizzle-orm/pg-core';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Provider {
  GOOGLE = 'google',
}

export enum GameResult {
  DRAW = 'draw',
  LOSE = 'lose',
  WIN = 'win',
}

export const userRoleEnum = pgEnum('user_role', [
  UserRole.ADMIN,
  UserRole.USER,
]);

export const providerEnum = pgEnum('provider', [Provider.GOOGLE]);

export const gameResultEnum = pgEnum('game_result', [
  GameResult.DRAW,
  GameResult.LOSE,
  GameResult.WIN,
]);
