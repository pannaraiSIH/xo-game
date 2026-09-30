import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameResult } from 'src/db';

export class CreateGameResultDto {
  @Type(() => String)
  @IsString()
  @IsEnum(GameResult)
  @IsNotEmpty()
  result: GameResult;
}

@Exclude()
export class CurrentUserScoreData {
  @Expose()
  totalScore: number;

  @Expose()
  currentStreak: number;

  @Expose()
  hasBonus: boolean;

  @Expose()
  updatedAt: Date | null;
}

export class GetUserScoresDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number = 10;
}

@Exclude()
class User {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

@Exclude()
export class UserScoresData {
  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  currentStreak: number;

  @Expose()
  totalScore: number;

  @Expose()
  updatedAt: Date;
}
