import { Provider } from 'src/db';

export interface CreateUserProvider {
  userId: number;
  provider: Provider;
  providerId: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  provider: Provider;
  providerId: string;
}
