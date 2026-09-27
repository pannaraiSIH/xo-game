import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { and, eq } from 'drizzle-orm';
import {
  Database,
  Provider,
  User,
  userProviders,
  UserRole,
  users,
} from 'src/db';
import { CreateUser, CreateUserProvider } from './users.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDrizzle() private readonly db: Database,
    private configService: ConfigService,
  ) {}

  findUserByProvider(provider: Provider, providerId: string): Promise<User[]> {
    return this.db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(userProviders, eq(userProviders.userId, users.id))
      .where(
        and(
          eq(userProviders.provider, provider),
          eq(userProviders.providerUid, providerId),
        ),
      )
      .limit(1);
  }

  findUserById(userId: number): Promise<User[]> {
    return this.db.select().from(users).where(eq(users.id, userId)).limit(1);
  }

  createUser(user: CreateUser): Promise<User[]> {
    const role =
      user.email === this.configService.get<string>('ADMIN_EMAIL')
        ? UserRole.ADMIN
        : UserRole.USER;

    return this.db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role,
        })
        .returning();
      await tx.insert(userProviders).values({
        userId: newUser[0].id,
        provider: user.provider,
        providerUid: user.providerId,
      });
      return newUser;
    });
  }

  async createUserProvider(provider: CreateUserProvider): Promise<void> {
    await this.db
      .insert(userProviders)
      .values({
        userId: provider.userId,
        provider: provider.provider,
        providerUid: provider.providerId,
      })
      .onConflictDoNothing();
  }
}
