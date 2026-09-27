import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { GoogleAuthService } from './providers/google-auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  providers: [AuthService, GoogleAuthService, GoogleStrategy],
  controllers: [AuthController],
  imports: [UsersModule, PassportModule],
})
export class AuthModule {}
