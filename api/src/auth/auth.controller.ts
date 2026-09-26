import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OauthLoginDto, ProfileData } from './auth.dto';
import { ResponseDto } from 'src/common';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() dto: OauthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    const { accessToken } = await this.authService.oauthLogin(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): ResponseDto {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<ResponseDto<ProfileData>> {
    const profile = await this.authService.getProfile(req.user!.sub);
    return { success: true, data: plainToInstance(ProfileData, profile) };
  }
}
