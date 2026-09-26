import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleAuthService } from './providers/google-auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { Provider } from 'src/db';
import { OauthLoginData, OauthLoginDto, ProfileData } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async oauthLogin(signUpDto: OauthLoginDto): Promise<OauthLoginData> {
    const profile = await this.googleAuthService.verifyToken(signUpDto.idToken);

    const exists = await this.usersRepository.findUserByEmail(profile.email);
    let user = exists[0];

    if (!user) {
      const local = profile.email.split('@')[0];
      const created = await this.usersRepository.createUser({
        ...profile,
        firstName: profile.firstName ?? local,
        lastName: profile.lastName ?? local,
        provider: Provider.GOOGLE,
      });

      user = created[0];
    } else {
      await this.usersRepository.createUserProvider({
        userId: exists[0].id,
        provider: Provider.GOOGLE,
        providerId: profile.providerId,
      });
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return { accessToken };
  }

  async getProfile(userId: number): Promise<ProfileData> {
    const [user] = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
