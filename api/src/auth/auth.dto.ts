import { IsNotEmpty, IsString } from 'class-validator';

export class OauthLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export interface OauthLoginData {
  accessToken: string;
}
