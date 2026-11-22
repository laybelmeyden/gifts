import { z } from 'zod';
import { t } from './i18n';

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const NAME_MAX = 40;

const v = t.validation;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, v.emailRequired)
  .max(254, v.emailTooLong)
  .pipe(z.email(v.emailInvalid));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, v.passwordMin(PASSWORD_MIN))
  .max(PASSWORD_MAX, v.passwordMax(PASSWORD_MAX));

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, v.passwordRequired),
});

export const nameSchema = z.string().trim().min(1, v.nameRequired).max(NAME_MAX, v.nameMax(NAME_MAX));

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
