import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { PASSWORD_MAX, PASSWORD_MIN } from '../../contracts/auth';
import { USER_ROLES } from '../../contracts/user';
import { db } from '../db';
import * as schema from '../db/schema';

// Прод — BETTER_AUTH_URL; превью-деплои Vercel — их собственный адрес; локально — localhost.
function resolveBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

const extraOrigins = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
  .filter((host): host is string => Boolean(host))
  .map((host) => `https://${host}`);

export const auth = betterAuth({
  appName: 'Gifts',
  baseURL: resolveBaseUrl(),
  trustedOrigins: extraOrigins,
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    minPasswordLength: PASSWORD_MIN,
    maxPasswordLength: PASSWORD_MAX,
  },
  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  rateLimit: {
    storage: 'database',
  },
  plugins: [nextCookies()],
});
