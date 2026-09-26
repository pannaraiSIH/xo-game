import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateGameResultDto,
  UserScoresData,
  GetUserScoresDto,
  UserScoreData,
} from './game.dto';
import { Request } from 'express';
import { GameService } from './game.service';
import { ResponseDto } from 'src/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/db';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @UseGuards(AuthGuard)
  @Post('result')
  async createGameResult(
    @Body() dto: CreateGameResultDto,
    @Req() req: Request,
  ): Promise<ResponseDto<UserScoreData>> {
    const userScore = await this.gameService.createGameResult(
      dto,
      req.user!.sub,
    );

    return { success: true, data: plainToInstance(UserScoreData, userScore) };
  }

  @Get('user-scores')
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  async getUserScores(
    @Query() dto: GetUserScoresDto,
  ): Promise<ResponseDto<UserScoresData[]>> {
    const userScores = await this.gameService.getUserScores(dto);

    return { success: true, data: plainToInstance(UserScoresData, userScores) };
  }
}
