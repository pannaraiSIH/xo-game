import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { OAuthResponse } from './providers.interface';

@Injectable()
export class GoogleAuthService {
  private googleClient: OAuth2Client;
  private googleClientId: string;

  constructor(private configService: ConfigService) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID')!;
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async verifyToken(idToken: string): Promise<OAuthResponse> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload?.email) {
        throw new UnauthorizedException('Invalid OAuth token');
      }

      return {
        providerId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
      };
    } catch {
      throw new UnauthorizedException('Invalid OAuth token');
    }
  }
}
