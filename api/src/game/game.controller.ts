import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  CreateGameResultDto,
  UserScoresData,
  GetUserScoresDto,
  CurrentUserScoreData,
} from './game.dto';
import { GameService } from './game.service';
import { ResponseDto } from 'src/common';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/db';
import { AuthenticatedRequest } from 'src/auth/auth.interface';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('result')
  async createGameResult(
    @Body() dto: CreateGameResultDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResponseDto<CurrentUserScoreData>> {
    const currentScore = await this.gameService.createGameResult(
      dto,
      req.user!.sub,
    );

    return {
      success: true,
      data: plainToInstance(CurrentUserScoreData, currentScore),
    };
  }

  @Get('score')
  async getCurrentUserScore(
    @Req() req: AuthenticatedRequest,
  ): Promise<ResponseDto<CurrentUserScoreData>> {
    const currentScore = await this.gameService.getCurrentUserScore(
      req.user!.sub,
    );

    return {
      success: true,
      data: plainToInstance(CurrentUserScoreData, currentScore),
    };
  }

  @Get('user-scores')
  @Roles([UserRole.ADMIN])
  async getUserScores(
    @Query() dto: GetUserScoresDto,
  ): Promise<ResponseDto<UserScoresData[]>> {
    const userScores = await this.gameService.getUserScores(dto);

    return { success: true, data: plainToInstance(UserScoresData, userScores) };
  }
}
