import { UserRole } from 'src/db';

export interface GoogleProfile {
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export interface GoogleAuthRequest extends Request {
  user: GoogleProfile;
}

export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}
