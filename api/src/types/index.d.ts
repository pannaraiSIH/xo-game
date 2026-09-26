import { JwtPayload } from 'src/auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
