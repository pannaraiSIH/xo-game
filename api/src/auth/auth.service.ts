import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { Provider } from 'src/db';
import { OauthLoginData, ProfileData } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, GoogleProfile } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async googleLogin(profile: GoogleProfile): Promise<OauthLoginData> {
    const [existing] = await this.usersRepository.findUserByProvider(
      Provider.GOOGLE,
      profile.providerId,
    );
    let user = existing;

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
        userId: existing.id,
        provider: Provider.GOOGLE,
        providerId: profile.providerId,
      });
    }

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

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
