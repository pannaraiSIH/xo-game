import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from './providers/google-auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { Provider } from 'src/db';
import { SignUpDto } from './auth.dto';
import { ResponseDto } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private usersRepository: UsersRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<ResponseDto> {
    const profile = await this.googleAuthService.verifyToken(signUpDto.idToken);

    const exists = await this.usersRepository.findUserByEmail(profile.email);
    if (!exists.length) {
      const local = profile.email.split('@')[0];

      await this.usersRepository.createUser({
        ...profile,
        firstName: profile.firstName ?? local,
        lastName: profile.lastName ?? local,
        provider: Provider.GOOGLE,
      });
    } else {
      await this.usersRepository.createUserProvider({
        userId: exists[0].id,
        provider: Provider.GOOGLE,
        providerId: profile.providerId,
      });
    }

    return { success: true };
  }
}
