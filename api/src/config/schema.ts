import z from 'zod';

export const validationSchema = z.object({
  APP_NAME: z.string().default('xo-game'),
  NODE_ENV: z.enum(['development', 'product']).default('development'),
  APP_PORT: z.coerce.number().default(8889),
  DATABASE_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.string().optional(),
  FRONTEND_URL: z.string().min(1),
});
