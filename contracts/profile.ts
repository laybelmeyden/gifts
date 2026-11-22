import { z } from 'zod';
import { emailSchema, nameSchema } from './auth';

const reservedHandles = new Set([
  'admin',
  'api',
  'auth',
  'gifts',
  'list',
  'login',
  'me',
  'profile',
  'register',
  'rules',
  'sign-in',
  'sign-up',
  'u',
]);

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, 'Ник - минимум 2 символа.')
  .max(24, 'Ник - максимум 24 символа.')
  .regex(/^[a-z][a-z0-9_]*$/, 'Только латиница, цифры и подчёркивание. С буквы.')
  .refine((value) => !reservedHandles.has(value), 'Этот ник нельзя занять.');

export const birthdaySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])$/.test(value), 'Введите дату как дд.мм.')
  .refine((value) => {
    if (!value) return true;
    const [day, month] = value.split('.').map(Number);
    const days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ?? 0;
    return day <= days;
  }, 'Введите дату как дд.мм.');

export const updateProfileSchema = z.object({
  name: nameSchema,
  handle: handleSchema,
  email: emailSchema,
  birthday: birthdaySchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type ProfileFields = {
  name: string;
  email: string;
  handle: string | null;
  birthday: string | null;
};
