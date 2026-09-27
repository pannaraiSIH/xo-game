import {
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
import { ResponseDto } from 'src/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { AuthenticatedRequest, GoogleAuthRequest } from './auth.interface';
import { ProfileData } from './auth.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: GoogleAuthRequest,
    @Res() res: Response,
  ) {
    const response = await this.authService.googleLogin(req.user);

    res.cookie('access_token', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.redirect(`${process.env.CLIENT_URL!}/`);
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

  @Get('profile')
  async getProfile(
    @Req() req: AuthenticatedRequest,
  ): Promise<ResponseDto<ProfileData>> {
    const profile = await this.authService.getProfile(req.user!.sub);
    return { success: true, data: plainToInstance(ProfileData, profile) };
  }
}
