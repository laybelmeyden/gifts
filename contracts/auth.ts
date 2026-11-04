import { z } from 'zod';

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Введите почту.')
  .max(254, 'Слишком длинная почта.')
  .pipe(z.email('Некорректная почта.'));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Пароль — минимум ${PASSWORD_MIN} символов.`)
  .max(PASSWORD_MAX, `Пароль — максимум ${PASSWORD_MAX} символов.`);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Введите пароль.'),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
