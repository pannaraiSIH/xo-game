import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OauthLoginData, OauthLoginDto } from './auth.dto';
import { ResponseDto } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: OauthLoginDto,
  ): Promise<ResponseDto<OauthLoginData>> {
    return this.authService.oauthLogin(signUpDto);
  }
}
