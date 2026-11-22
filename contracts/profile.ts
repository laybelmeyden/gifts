import { z } from 'zod';
import { emailSchema, nameSchema } from './auth';
import { t } from './i18n';

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

const HANDLE_MIN = 2;
const HANDLE_MAX = 24;
const v = t.validation;

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(HANDLE_MIN, v.handleMin(HANDLE_MIN))
  .max(HANDLE_MAX, v.handleMax(HANDLE_MAX))
  .regex(/^[a-z][a-z0-9_]*$/, v.handleFormat)
  .refine((value) => !reservedHandles.has(value), v.handleReserved);

export const birthdaySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])$/.test(value), v.birthdayFormat)
  .refine((value) => {
    if (!value) return true;
    const [day, month] = value.split('.').map(Number);
    const days = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ?? 0;
    return day <= days;
  }, v.birthdayFormat);

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
