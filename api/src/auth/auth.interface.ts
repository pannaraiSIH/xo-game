import { UserRole } from 'src/db';

export interface JwtPayload {
  sub: number;
  role: UserRole;
}
