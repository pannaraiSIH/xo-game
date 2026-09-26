import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { GoogleAuthService } from './providers/google-auth.service';

@Module({
  providers: [AuthService, GoogleAuthService],
  controllers: [AuthController],
  imports: [ConfigModule, UsersModule],
})
export class AuthModule {}
