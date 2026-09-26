import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq, sql } from 'drizzle-orm';
import { Database, User, userProviders, users } from 'src/db';
import { CreateUser, CreateUserProvider } from './users.interface';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  findUserByEmail(email: string): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(eq(sql`lower(email)`, email.toLowerCase()))
      .limit(1);
  }

  createUser(user: CreateUser): Promise<User[]> {
    return this.db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
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
