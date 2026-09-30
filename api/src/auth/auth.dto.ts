import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class OauthLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export interface OauthLoginData {
  accessToken: string;
}

@Exclude()
export class ProfileData {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;
}
