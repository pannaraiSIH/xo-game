import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { Database, GameResult, gameResults, users, userScores } from 'src/db';
import {
  CreateGameResultDto,
  UserScoresData,
  GetUserScoresDto,
  CurrentUserScoreData,
} from './game.dto';
import { desc, eq, sql } from 'drizzle-orm';
import { Pagination } from 'src/common';

@Injectable()
export class GameService {
  constructor(@InjectDrizzle() private db: Database) {}

  async createGameResult(
    { result }: CreateGameResultDto,
    userId: number,
  ): Promise<CurrentUserScoreData> {
    const score = await this.db.transaction(async (tx) => {
      const isWin = result === GameResult.WIN;

      const [currentScore] = await tx
        .select()
        .from(userScores)
        .where(eq(userScores.userId, userId))
        .limit(1);

      const currentStreak = currentScore?.currentStreak ?? 0;
      const hasBonus = currentStreak === 2 && isWin;
      const scoreChange = isWin ? (hasBonus ? 2 : 1) : -1;

      await tx
        .insert(gameResults)
        .values({ userId, result: result, scoreChange });

      // doesn't specify how negative score should be handled
      // assumption: minimum total score is 0
      const totalScore = Math.max(
        (currentScore?.totalScore ?? 0) + scoreChange,
        0,
      );
      const nextStreak = hasBonus || !isWin ? 0 : currentStreak + 1;

      const [newUserScore] = await tx
        .insert(userScores)
        .values({
          userId,
          totalScore: totalScore,
          currentStreak: nextStreak,
        })
        .onConflictDoUpdate({
          target: userScores.userId,
          set: { totalScore, currentStreak: nextStreak },
        })
        .returning();

      return { ...newUserScore, hasBonus };
    });

    return score;
  }

  async getCurrentUserScore(userId: number): Promise<CurrentUserScoreData> {
    const [currentScore] = await this.db
      .select()
      .from(userScores)
      .where(eq(userScores.userId, userId))
      .limit(1);

    if (!currentScore) {
      return {
        totalScore: 0,
        currentStreak: 0,
        hasBonus: false,
        updatedAt: null,
      };
    }

    return { ...currentScore, hasBonus: false };
  }

  async getUserScores({ limit, page }: GetUserScoresDto): Promise<{
    scores: UserScoresData[];
    pagination: Pagination;
  }> {
    const offset = (page - 1) * limit;

    const [scores, [countResult]] = await Promise.all([
      this.db
        .select({
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
          currentStreak: userScores.currentStreak,
          totalScore: userScores.totalScore,
          updatedAt: userScores.updatedAt,
        })
        .from(userScores)
        .innerJoin(users, eq(users.id, userScores.userId))
        .orderBy(desc(userScores.totalScore))
        .offset(offset)
        .limit(limit),

      this.db.select({ count: sql<number>`count(*)` }).from(userScores),
    ]);

    const total = Number(countResult.count);

    return {
      scores,
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
