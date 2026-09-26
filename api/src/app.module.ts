import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './db';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema,
    }),
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.DATABASE_URL!,
      relations,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
